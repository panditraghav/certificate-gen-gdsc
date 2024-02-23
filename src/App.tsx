import React, { useEffect, useState } from "react";
import gdscLogo from "/gdsc_logo.png";
import papaparse from "papaparse";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPdfLink } from "./lib/pdf";

function App() {
  const [participants, setParticipants] = useState<Array<Array<string>>>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    async function fetchCSV() {
      try {
        const res = await fetch("/study_jam_participants.csv");
        const data = await res.text();
        const parsed = papaparse.parse(data).data as Array<Array<string>>;
        const completed = parsed.filter((p) => {
          return p[2] == "Yes";
        });
        setParticipants(completed);
      } catch (error) {
        console.log(error);
      }
    }
    fetchCSV();
  }, []);

  async function handleDownload() {
    if (selected !== "") {
      const link = await getPdfLink(selected);
      window.open(link, "_blank");
    }
  }

  return (
    <div className="flex items-center justify-center flex-col h-screen space-y-12 bg-background">
      <div>
        <img src={gdscLogo} className="h-24" alt="GDSC Logo" />
      </div>
      <h1 className="text-3xl">Google cloud study jams</h1>
      <NameSelect participants={participants} onChange={setSelected} />
      <Button onClick={handleDownload}>Download</Button>
    </div>
  );
}

export default App;

function NameSelect({
  participants,
  onChange,
}: {
  participants: Array<Array<string>>;
  onChange: (arg0: string) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? participants.find(
                (participant) => participant[0].toLowerCase() === value,
              )?.[0]
            : "Select Name"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] h-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandEmpty>No framework found.</CommandEmpty>
          <CommandGroup>
            {participants.map((participant) => (
              <CommandItem
                key={participant[0]}
                value={participant[0]}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  onChange(
                    currentValue === value
                      ? ""
                      : currentValue
                          .split(" ")
                          .map((s) => {
                            return s[0]?.toUpperCase() + s.slice(1);
                          })
                          .join(" "),
                  );
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === participant[0] ? "opacity-100" : "opacity-0",
                  )}
                />
                {participant[0]}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
