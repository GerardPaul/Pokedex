// Pixel UI building blocks in the style of the Pokémon GBA/DS games:
// square corners, thick ink borders and hard (unblurred) drop shadows.
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Animated, Easing, Pressable, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { router } from "expo-router";
import { CachedImage } from "@/components/CachedImage";
import * as Haptics from "expo-haptics";
import { animatedSpriteUrl, pokeballUrl, spriteUrlFromId } from "@/lib/pokeapi";
import { typeColor, typeIconUrl } from "@/lib/typeColors";
import colors from "@/lib/colors";

const SHADOW = 4;

/** Light haptic tick; haptics are unavailable on web, so failures are ignored. */
export function tap() {
  Haptics.selectionAsync().catch(() => {});
}

// Outlined text reads on any background (white text on yellow/pink type colors).
const OUTLINE = { textShadowColor: colors.ink, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 };

interface PixelBoxProps {
  children?: ReactNode;
  /** Inner content classes (padding, layout). */
  className?: string;
  /** Outer classes (width, margin, flex). */
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
  /** Fill color instead of white. */
  tint?: string;
  shadow?: boolean;
}

/** The game's dialogue box: ink outer border, shade inner border, hard drop shadow. */
export function PixelBox({ children, className, containerClassName, style, tint, shadow = true }: PixelBoxProps) {
  return (
    <View className={containerClassName} style={[{ marginRight: SHADOW, marginBottom: SHADOW }, style]}>
      {shadow && (
        <View
          className="absolute bg-ink"
          style={{ top: SHADOW, left: SHADOW, right: -SHADOW, bottom: -SHADOW }}
        />
      )}
      {/* White base under the tint, so a translucent tint never shows the shadow through */}
      <View className="border-[3px] border-ink bg-paper">
        <View
          className={`border-2 border-shade/60 ${className ?? ""}`}
          style={tint ? { backgroundColor: tint } : undefined}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

interface PixelButtonProps extends Omit<PixelBoxProps, "shadow" | "style"> {
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  selected?: boolean;
}

/** A PixelBox that sinks into its shadow while pressed, like a physical button. */
export function PixelButton({
  onPress,
  disabled,
  accessibilityLabel,
  selected,
  containerClassName,
  ...box
}: PixelButtonProps) {
  return (
    <Pressable
      className={containerClassName}
      onPress={() => {
        tap();
        onPress();
      }}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled, selected }}
    >
      {({ pressed }) => (
        <PixelBox
          {...box}
          shadow={!pressed}
          style={[
            pressed && { transform: [{ translateX: SHADOW }, { translateY: SHADOW }] },
            disabled && { opacity: 0.4 },
          ]}
        />
      )}
    </Pressable>
  );
}

/** Title bar used at the top of every screen, with an optional ◀ back button and a right slot. */
export function ScreenHeader({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <View className="flex-row items-center px-3 pt-2 pb-1 gap-2">
      {back && (
        <PixelButton
          onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
          accessibilityLabel="Go back"
          className="px-2 py-1.5"
        >
          <Text className="font-Pixel text-[12px] text-ink">◀</Text>
        </PixelButton>
      )}
      <PixelBox containerClassName="flex-1" className="px-3 py-2 flex-row items-center justify-between">
        <Text className="font-Pixel text-[13px] text-ink" numberOfLines={1}>
          {title}
        </Text>
        {right}
      </PixelBox>
    </View>
  );
}

/** Game-style HP bar for a base stat: green, then yellow, then red as the value drops. */
export function HpBar({ label, value, max = 200 }: { label: string; value: number; max?: number }) {
  const color = value < 50 ? colors.hpRed : value < 90 ? colors.hpYellow : colors.hpGreen;
  const pct = Math.min((value / max) * 100, 100);
  return (
    <View className="flex-row items-center gap-2 mb-2">
      <Text className="font-Pixel text-[10px] text-ink w-16">{label}</Text>
      <Text className="font-Pixel text-[10px] text-ink w-9 text-right">{value}</Text>
      <View className="flex-1 h-3.5 border-2 border-ink bg-shade/30 justify-center">
        <View className="h-full" style={{ width: `${pct}%`, backgroundColor: color }}>
          {/* pixel highlight along the top of the bar */}
          <View className="h-[2px] bg-white/50" />
        </View>
      </View>
    </View>
  );
}

interface TypeBadgeProps {
  type: string;
  iconOnly?: boolean;
  selected?: boolean;
  dimmed?: boolean;
}

/** Square type badge: type color, white glyph and an outlined label. */
export function TypeBadge({ type, iconOnly, selected, dimmed }: TypeBadgeProps) {
  return (
    <View
      className={`flex-row items-center justify-center border-ink ${iconOnly ? "w-10 h-10" : "gap-1.5 px-2 py-1.5"}`}
      style={{
        backgroundColor: typeColor(type),
        borderWidth: selected ? 3 : 2,
        opacity: dimmed ? 0.35 : 1,
      }}
    >
      <CachedImage uri={typeIconUrl(type)} style={{ width: 16, height: 16 }} />
      {!iconOnly && (
        <Text className="font-Pixel text-[10px] text-white uppercase" style={OUTLINE}>
          {type}
        </Text>
      )}
    </View>
  );
}

/** Animated Showdown sprite, falling back to the static sprite where no GIF exists. */
export function Sprite({
  id,
  shiny = false,
  size,
  animated = true,
}: {
  id: number;
  shiny?: boolean;
  size: number;
  animated?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [id, shiny]);

  return (
    <CachedImage
      uri={failed || !animated ? spriteUrlFromId(id, shiny) : animatedSpriteUrl(id, shiny)}
      style={{ width: size, height: size }}
      contentFit="contain"
      onError={() => setFailed(true)}
      recyclingKey={`sprite-${id}-${shiny}-${failed}`}
    />
  );
}

/** Bouncing Poké Ball loading indicator. */
export function PixelLoader() {
  const y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(y, { toValue: -12, duration: 260, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(y, { toValue: 0, duration: 260, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      ])
    );
    bounce.start();
    return () => bounce.stop();
  }, [y]);

  return (
    <View className="flex-1 items-center justify-center py-10">
      <Animated.View style={{ transform: [{ translateY: y }] }}>
        <CachedImage uri={pokeballUrl} style={{ width: 40, height: 40 }} />
      </Animated.View>
      <Text className="font-Pixel text-[10px] text-ink mt-3">Loading...</Text>
    </View>
  );
}

/** A dialogue box with a message, for empty and error states. */
export function Message({ text }: { text: string }) {
  return (
    <View className="px-4 py-8">
      <PixelBox className="px-4 py-4">
        <Text className="font-PixelBody text-lg text-ink text-center">{text}</Text>
      </PixelBox>
    </View>
  );
}
