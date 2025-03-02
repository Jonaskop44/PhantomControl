export interface KPIStatProps {
  title: string;
  value: number;
  change: string;
  changeType: "positive" | "neutral" | "negative";
  trendChipPosition: "top" | "bottom";
  iconName: string;
}
