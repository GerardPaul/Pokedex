// Pixel/device UI kit, styled after the Compendeon device mockup: light-blue screens with
// chamfered corners and grey bezels, dark outlines, and buttons with a darker 3D side that
// sinks when pressed. Text uses the pixel fonts.
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Animated,
  Easing,
  Pressable,
  Text,
  View,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Svg, { Circle, G, Path, Polygon, Rect } from "react-native-svg";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import { CachedImage } from "@/components/CachedImage";
import { animatedSpriteUrl, pokeballUrl, spriteUrlFromId } from "@/lib/pokeapi";
import { typeColor, typeIconUrl } from "@/lib/typeColors";
import colors from "@/lib/colors";

const DEPTH = 4; // height of a button's 3D side
const OUTLINE_W = 2;
const BEZEL_W = 3;

/** Light haptic tick; haptics are unavailable on web, so failures are ignored. */
export function tap() {
  Haptics.selectionAsync().catch(() => {});
}

// Outlined text reads on any background (white text on yellow/pink type colors).
const OUTLINE = { textShadowColor: colors.ink, textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 0 };

/** Points of a w×h rectangle with 45° corners cut by `cut`, shrunk inward by `inset`. */
function chamfer(w: number, h: number, cut: number, inset: number): string {
  const i = inset;
  const c = Math.max(cut - inset * 0.41, 0); // keeps the diagonal edges parallel when insetting
  return [
    [i + c, i], [w - i - c, i], [w - i, i + c], [w - i, h - i - c],
    [w - i - c, h - i], [i + c, h - i], [i, h - i - c], [i, i + c],
  ].map((p) => p.join(",")).join(" ");
}

function useSize() {
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((s) => (s && s.w === width && s.h === height ? s : { w: width, h: height }));
  };
  return { size, onLayout };
}

interface PixelBoxProps {
  children?: ReactNode;
  /** Inner content classes (padding, layout). */
  className?: string;
  /** Outer classes (width, margin, flex). */
  containerClassName?: string;
  style?: StyleProp<ViewStyle>;
  /** Fill color instead of the light-blue screen. */
  tint?: string;
  /** Grey bezel ring inside the outline. */
  bezel?: boolean;
  /** Corner cut size. */
  cut?: number;
  /** Draw a 3D side under the box (buttons). */
  raised?: boolean;
  /** Sunk into its side, like a pressed button. */
  pressed?: boolean;
  /** Color of the 3D side. */
  sideColor?: string;
}

/** A device screen: chamfered corners, dark outline, grey bezel, light-blue fill. */
export function PixelBox({
  children,
  className,
  containerClassName,
  style,
  tint,
  bezel = true,
  cut = 9,
  raised,
  pressed,
  sideColor = colors.ink,
}: PixelBoxProps) {
  const { size, onLayout } = useSize();
  const depth = raised ? DEPTH : 0;
  const sink = raised && pressed ? DEPTH : 0;
  const inner = OUTLINE_W + (bezel ? BEZEL_W : 0);

  return (
    <View className={containerClassName} style={style} onLayout={onLayout}>
      {size && (
        <Svg width={size.w} height={size.h} style={{ position: "absolute", top: 0, left: 0 }}>
          {raised && !pressed && (
            <Polygon points={chamfer(size.w, size.h, cut, 0)} fill={sideColor} />
          )}
          {/* Face: its own height leaves room for the side below; pressed moves it down onto the side */}
          <G y={sink}>
            <Polygon points={chamfer(size.w, size.h - depth, cut, 0)} fill={colors.ink} />
            {bezel && <Polygon points={chamfer(size.w, size.h - depth, cut, OUTLINE_W)} fill={colors.bezel} />}
            <Polygon points={chamfer(size.w, size.h - depth, cut, inner)} fill={tint ?? colors.screen} />
          </G>
        </Svg>
      )}
      <View style={{ margin: inner, marginBottom: inner + depth, transform: [{ translateY: sink }] }} className={className}>
        {children}
      </View>
    </View>
  );
}

interface PixelButtonProps extends Omit<PixelBoxProps, "raised" | "pressed" | "style"> {
  onPress: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  selected?: boolean;
}

/** A raised PixelBox that sinks into its 3D side while pressed. */
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
        <PixelBox {...box} raised pressed={pressed || selected} style={disabled ? { opacity: 0.4 } : undefined} />
      )}
    </Pressable>
  );
}

/** Lime/ink diagonal hazard stripes from the top of the device. */
export function HazardStripes({ height = 12 }: { height?: number }) {
  return (
    <View className="bg-ink overflow-hidden flex-row" style={{ height }}>
      {Array.from({ length: 60 }, (_, i) => (
        <View
          key={i}
          className="bg-lime"
          style={{
            width: 7,
            // The first stripe starts just past the left edge so the pattern is cut evenly, like on the right
            marginLeft: i === 0 ? -4 : 6,
            height: height * 2,
            marginTop: -height / 2,
            transform: [{ skewX: "-35deg" }],
          }}
        />
      ))}
    </View>
  );
}

/** The device's Poké Ball emblem: split vertically, red left and white right. */
export function PokeballEmblem({ size = 44 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Circle cx={50} cy={50} r={48} fill={colors.ink} />
      <Path d="M50 8 A42 42 0 0 0 50 92 Z" fill={colors.shell} />
      <Path d="M50 8 A42 42 0 0 1 50 92 Z" fill="#FFFFFF" />
      <Rect x={45} y={6} width={10} height={88} fill={colors.ink} />
      <Circle cx={50} cy={50} r={16} fill={colors.ink} />
      <Circle cx={50} cy={50} r={9} fill="#FFFFFF" />
    </Svg>
  );
}

/** Red shell header with hazard stripes, an optional ◀ back button, a title screen and a right slot. */
export function ScreenHeader({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <View className="bg-shell border-b-2 border-ink">
      <HazardStripes />
      <View className="flex-row items-center px-3 pt-2.5 pb-3 gap-2">
        {back && (
          <PixelButton
            onPress={() => (router.canGoBack() ? router.back() : router.replace("/"))}
            accessibilityLabel="Go back"
            className="px-2.5 py-1.5"
            tint={colors.steel}
            bezel={false}
            cut={5}
          >
            <Text className="font-Pixel text-[12px] text-white">◀</Text>
          </PixelButton>
        )}
        <PixelBox containerClassName="flex-1" className="px-3 py-1.5 flex-row items-center justify-between">
          <Text className="font-Pixel text-[13px] text-ink" numberOfLines={1}>
            {title}
          </Text>
          {right}
        </PixelBox>
      </View>
    </View>
  );
}

/** ◀ / ▶ triangle button from the device shell, with a darker 3D side. */
export function TriangleButton({
  direction,
  onPress,
  accessibilityLabel,
}: {
  direction: "left" | "right";
  onPress: (() => void) | null;
  accessibilityLabel: string;
}) {
  // Drawn pointing left, then mirrored for right
  const face = "4,30 34,6 34,54";
  const side = "4,30 34,54 34,62 4,38";
  return (
    <Pressable
      onPress={() => {
        if (!onPress) return;
        tap();
        onPress();
      }}
      disabled={!onPress}
      hitSlop={10}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled: !onPress }}
      style={{ opacity: onPress ? 1 : 0.35 }}
    >
      {({ pressed }) => (
        <Svg width={38} height={64} viewBox="0 0 38 64" style={{ transform: [{ scaleX: direction === "right" ? -1 : 1 }] }}>
          {!pressed && <Polygon points={side} fill={colors.ink} />}
          <G y={pressed ? 6 : 0}>
            <Polygon points={face} fill={colors.steel} stroke={colors.ink} strokeWidth={2} />
          </G>
        </Svg>
      )}
    </Pressable>
  );
}

/** A colored device button (round or rectangular) with a label; `selected` keeps it pressed in. */
export function DeviceButton({
  label,
  color,
  sideColor,
  round,
  selected,
  onPress,
}: {
  label: string;
  color: string;
  sideColor: string;
  round?: boolean;
  selected?: boolean;
  onPress: () => void;
}) {
  const w = round ? 44 : 48;
  const h = round ? 44 : 24;
  return (
    <Pressable
      onPress={() => {
        tap();
        onPress();
      }}
      className="items-center"
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={label}
    >
      {({ pressed }) => {
        const down = pressed || selected ? DEPTH : 0;
        return (
          <>
            <View style={{ width: w + 6, height: h + DEPTH + 6, alignItems: "center", justifyContent: "flex-start" }}>
              {/* recessed ring around the button */}
              <View
                className="absolute bg-body-dark"
                style={{ top: 0, width: w + 6, height: h + DEPTH + 6, borderRadius: round ? 999 : 4 }}
              />
              <View
                style={{
                  marginTop: 3,
                  width: w,
                  height: h + DEPTH,
                  borderRadius: round ? 999 : 3,
                  backgroundColor: sideColor,
                }}
              >
                <View
                  style={{
                    marginTop: down,
                    width: w,
                    height: h,
                    borderRadius: round ? 999 : 3,
                    backgroundColor: color,
                    borderWidth: 2,
                    borderColor: colors.ink,
                  }}
                />
              </View>
            </View>
            <Text className={`font-Pixel text-[8px] mt-1.5 ${selected ? "text-lime" : "text-muted"}`}>{label}</Text>
          </>
        );
      }}
    </Pressable>
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
      <View className="flex-1 h-3.5 border-2 border-ink bg-white/50 justify-center">
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
        borderColor: selected ? colors.lime : colors.ink,
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

/** Bouncing Poké Ball loading indicator. `onScreen` switches the label to dark text for light-blue screens. */
export function PixelLoader({ onScreen }: { onScreen?: boolean }) {
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
      <Text className={`font-Pixel text-[10px] mt-3 ${onScreen ? "text-ink" : "text-screen"}`}>Loading...</Text>
    </View>
  );
}

/** A screen with a message, for empty and error states. */
export function Message({ text }: { text: string }) {
  return (
    <View className="px-4 py-8">
      <PixelBox className="px-4 py-4">
        <Text className="font-PixelBody text-lg text-ink text-center">{text}</Text>
      </PixelBox>
    </View>
  );
}
