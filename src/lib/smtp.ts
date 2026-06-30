import { randomUUID } from "node:crypto";
import tls from "node:tls";

type SmtpResponse = {
  code: number;
  message: string;
};

type MailOptions = {
  host: string;
  port: number;
  user: string;
  pass: string;
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

type ResponseWaiter = {
  resolve: (response: string) => void;
  reject: (error: Error) => void;
  timer: NodeJS.Timeout;
};

const CRLF = "\r\n";

export async function sendSmtpMail(options: MailOptions) {
  const socket = tls.connect({
    host: options.host,
    port: options.port,
    servername: options.host
  });

  const reader = createSmtpReader(socket);

  await new Promise<void>((resolve, reject) => {
    socket.once("secureConnect", resolve);
    socket.once("error", reject);
  });

  try {
    await expectResponse(await reader.read(), [220]);
    await sendCommand(socket, reader, "EHLO velomacflowmeter.com", [250]);
    await sendCommand(socket, reader, "AUTH LOGIN", [334]);
    await sendCommand(socket, reader, Buffer.from(options.user).toString("base64"), [334]);
    await sendCommand(socket, reader, Buffer.from(options.pass).toString("base64"), [235]);
    await sendCommand(socket, reader, `MAIL FROM:<${cleanEmailAddress(options.user)}>`, [250]);
    await sendCommand(socket, reader, `RCPT TO:<${cleanEmailAddress(options.to)}>`, [250, 251]);
    await sendCommand(socket, reader, "DATA", [354]);

    socket.write(buildMessage(options) + `${CRLF}.${CRLF}`);
    await expectResponse(await reader.read(), [250]);
    await sendCommand(socket, reader, "QUIT", [221]);
  } finally {
    socket.end();
  }
}

function createSmtpReader(socket: tls.TLSSocket) {
  let buffer = "";
  let pendingLines: string[] = [];
  const responses: string[] = [];
  const waiters: ResponseWaiter[] = [];

  function settleResponse(response: string) {
    const waiter = waiters.shift();
    if (waiter) {
      clearTimeout(waiter.timer);
      waiter.resolve(response);
      return;
    }

    responses.push(response);
  }

  function rejectWaiters(error: Error) {
    while (waiters.length) {
      const waiter = waiters.shift();
      if (waiter) {
        clearTimeout(waiter.timer);
        waiter.reject(error);
      }
    }
  }

  socket.on("data", (chunk) => {
    buffer += chunk.toString("utf8");

    while (buffer.includes("\n")) {
      const newlineIndex = buffer.indexOf("\n");
      const line = buffer.slice(0, newlineIndex).replace(/\r$/, "");
      buffer = buffer.slice(newlineIndex + 1);
      pendingLines.push(line);

      if (/^\d{3} /.test(line)) {
        settleResponse(pendingLines.join("\n"));
        pendingLines = [];
      }
    }
  });

  socket.on("error", (error) => rejectWaiters(error));
  socket.on("end", () => rejectWaiters(new Error("SMTP connection ended before the message was sent.")));

  return {
    read(timeoutMs = 15000) {
      const existing = responses.shift();
      if (existing) {
        return Promise.resolve(existing);
      }

      return new Promise<string>((resolve, reject) => {
        const timer = setTimeout(() => {
          const index = waiters.findIndex((waiter) => waiter.resolve === resolve);
          if (index >= 0) {
            waiters.splice(index, 1);
          }
          reject(new Error("SMTP server response timed out."));
        }, timeoutMs);

        waiters.push({ resolve, reject, timer });
      });
    }
  };
}

async function sendCommand(
  socket: tls.TLSSocket,
  reader: ReturnType<typeof createSmtpReader>,
  command: string,
  expectedCodes: number[]
) {
  socket.write(command + CRLF);
  await expectResponse(await reader.read(), expectedCodes);
}

async function expectResponse(rawResponse: string, expectedCodes: number[]) {
  const response = parseResponse(rawResponse);

  if (!expectedCodes.includes(response.code)) {
    throw new Error(`Unexpected SMTP response ${response.code}: ${response.message}`);
  }
}

function parseResponse(rawResponse: string): SmtpResponse {
  const lines = rawResponse.split("\n");
  const lastLine = lines[lines.length - 1] ?? "";
  const code = Number(lastLine.slice(0, 3));

  return {
    code,
    message: rawResponse
  };
}

function buildMessage(options: MailOptions) {
  const from = `Velomac Website <${cleanEmailAddress(options.user)}>`;
  const to = `Velomac Sales <${cleanEmailAddress(options.to)}>`;
  const replyTo = cleanEmailAddress(options.replyTo);
  const body = dotStuff(options.text.replace(/\r?\n/g, CRLF));

  return [
    `From: ${from}`,
    `To: ${to}`,
    `Reply-To: ${replyTo}`,
    `Subject: ${cleanHeaderValue(options.subject)}`,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${Date.now()}.${randomUUID()}@velomacflowmeter.com>`,
    "",
    body
  ].join(CRLF);
}

function cleanHeaderValue(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function cleanEmailAddress(value: string) {
  return value.replace(/[\r\n<>,;]+/g, "").trim();
}

function dotStuff(value: string) {
  return value.replace(/^\./gm, "..");
}
