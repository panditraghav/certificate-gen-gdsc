import { generate } from "@pdfme/generator";
import { template } from "./template";

export async function getPdfLink(name: string): Promise<string> {
  return new Promise((resolve) => {
    generate({
      template: template,
      inputs: [
        {
          name: name,
          lead: "Poorab Patel",
          facilitator: "Sakshi Jagnania",
        },
      ],
    }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      resolve(url);
    });
  });
}
