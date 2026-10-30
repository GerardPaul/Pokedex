import { TextInput, Pressable, Text } from "react-native";
import { PixelBox } from "@/components/pixel";
import colors from "@/lib/colors";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = "Search name, #no. or type" }: SearchBarProps) {
  return (
    <PixelBox containerClassName="mx-3 mt-2" className="flex-row items-center px-3 py-1.5">
      <Text className="font-Pixel text-[12px] text-shell mr-2">▶</Text>
      <TextInput
        className="flex-1 font-PixelBody text-[18px] text-ink py-1.5"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Search Pokémon"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText("")} accessibilityLabel="Clear search" hitSlop={10}>
          <Text className="font-Pixel text-[12px] text-ink">✕</Text>
        </Pressable>
      )}
    </PixelBox>
  );
}
