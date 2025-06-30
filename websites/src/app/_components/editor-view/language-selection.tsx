"use client";
import { Language } from "@/@types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SUPPORTED_LANGUAGES } from "@/constants/language";
import { Dispatch, SetStateAction } from "react";

type Props = {
  selectedLanguage: Language;
  setSelectedLanguage: Dispatch<SetStateAction<Language>>;
};
export default function LanguageSelection({
  selectedLanguage,
  setSelectedLanguage,
}: Props) {
  return (
    <div className="space-y-2">
      <Select
        value={selectedLanguage}
        onValueChange={(e) => setSelectedLanguage(e as Language)}
      >
        <SelectTrigger className="bg-gray-800 text-white border-gray-700">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent className="bg-gray-800 text-white border-gray-700">
          {SUPPORTED_LANGUAGES.map((lang) => (
            <SelectItem
              key={lang.value}
              value={lang.value}
              className="hover:bg-gray-700"
            >
              {lang.label} ({lang.extension})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
