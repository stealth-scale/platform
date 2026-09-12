/**
 * Shows the button that hands the browser a file built in the page.
 */

import { DownloadIcon } from "lucide-react";

import { Row, type Scene, specimen } from "@stealthscale/foundation-specimen";

import { Button } from "#button/button.ts";
import { DownloadTrigger } from "#download-trigger/download-trigger.ts";

/**
 * What gets downloaded as a spreadsheet.
 */
const LEDGER = [
  "account,state,amount",
  "Bridge Ledger,settled,4120.00",
  "Halden & Co,held,880.40",
  "Perrin Freight,queued,12500.00",
].join("\n");

/**
 * What gets downloaded as a picture, built in the page rather than fetched.
 */
const MARK = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48">
  <rect width="48" height="48" rx="10" fill="#111"/>
</svg>`;

export const kinds: Scene = {
  about:
    "Nothing is fetched: the data is handed over as it stands, and the trigger’s job is to name it and give it a type the browser will save rather than open. Press any of them — each file is built where the button is.",
  draw: () => (
    <Row gap="3">
      <DownloadTrigger asChild data={LEDGER} fileName="ledger.csv" mimeType="text/csv">
        <Button colorPalette="primary" size="sm" variant="outline">
          <DownloadIcon size={14} /> ledger.csv
        </Button>
      </DownloadTrigger>

      <DownloadTrigger asChild data={MARK} fileName="mark.svg" mimeType="image/svg+xml">
        <Button colorPalette="primary" size="sm" variant="outline">
          <DownloadIcon size={14} /> mark.svg
        </Button>
      </DownloadTrigger>

      <DownloadTrigger
        asChild
        data={JSON.stringify({ held: 12, raised: 240 }, undefined, 2)}
        fileName="summary.json"
        mimeType="application/json"
      >
        <Button colorPalette="primary" size="sm" variant="outline">
          <DownloadIcon size={14} /> summary.json
        </Button>
      </DownloadTrigger>
    </Row>
  ),
  title: "Kinds of file",
};

export default specimen({
  about:
    "Hands the browser a file that was built in the page rather than requested from a server. It draws nothing of its own — it takes whatever control it is given.",
  group: "Controls",
  id: "controls/download-trigger",
  scenes: [kinds],
  title: "Download trigger",
});
