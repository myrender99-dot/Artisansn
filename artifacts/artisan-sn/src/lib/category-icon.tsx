import {
  Wrench, Home, Zap, Scissors, Car, Paintbrush, Briefcase,
  Sparkles, Building2, Leaf, Wind, Droplets, Hammer,
  Laptop, Code, BookOpen, GraduationCap, Camera, PartyPopper,
  ChefHat, Cake, Heart, SprayCan, HandHeart, Truck, Package,
  Flame, Grid3x3, Square, Refrigerator, Footprints, Sofa, Languages,
  type LucideIcon,
} from "lucide-react";

export function getCategoryIconComponent(name: string): LucideIcon {
  const n = name.toLowerCase();
  if (n.includes("plomb")) return Droplets;
  if (n.includes("électr") && (n.includes("ménager") || n.includes("menager"))) return Refrigerator;
  if (n.includes("electr") || n.includes("électr")) return Zap;
  if (n.includes("menuis") || n.includes("bois")) return Hammer;
  if (n.includes("coutur") || n.includes("taill")) return Scissors;
  if (n.includes("mécan") || n.includes("auto") || n.includes("mecan")) return Car;
  if (n.includes("coiff")) return Sparkles;
  if (n.includes("peint")) return Paintbrush;
  if (n.includes("maçon") || n.includes("macon") || n.includes("construc")) return Building2;
  if (n.includes("jardin") || n.includes("vert")) return Leaf;
  if (n.includes("clim")) return Wind;
  if (n.includes("développement") || n.includes("developpement") || n.includes("web") || n.includes("mobile")) return Code;
  if (n.includes("informa") || n.includes("ordinat")) return Laptop;
  if (n.includes("cours") || n.includes("tutorat") || n.includes("scolaire")) return BookOpen;
  if (n.includes("formation") || n.includes("éduc") || n.includes("educ")) return GraduationCap;
  if (n.includes("photo") || n.includes("vidéo") || n.includes("video")) return Camera;
  if (n.includes("événement") || n.includes("evenement") || n.includes("mariage") || n.includes("cérémon")) return PartyPopper;
  if (n.includes("traiteur") || n.includes("cuisine") || n.includes("restaur")) return ChefHat;
  if (n.includes("pâtiss") || n.includes("patiss") || n.includes("gâteau") || n.includes("gateau")) return Cake;
  if (n.includes("beauté") || n.includes("beaute") || n.includes("esthét") || n.includes("estheti") || n.includes("manucure") || n.includes("maquillage")) return Heart;
  if (n.includes("ménag") || n.includes("menag") || n.includes("nettoy")) return SprayCan;
  if (n.includes("aide") || n.includes("garde") || n.includes("domicile")) return HandHeart;
  if (n.includes("transport") || n.includes("livr")) return Truck;
  if (n.includes("démén") || n.includes("demen")) return Package;
  if (n.includes("soud") || n.includes("métall") || n.includes("metall") || n.includes("forge")) return Flame;
  if (n.includes("carre") || n.includes("faïence") || n.includes("faience")) return Grid3x3;
  if (n.includes("vitr") || n.includes("miroir")) return Square;
  if (n.includes("cordon") || n.includes("chauss")) return Footprints;
  if (n.includes("décor") || n.includes("decor") || n.includes("intérieur") || n.includes("interieur") || n.includes("aménag") || n.includes("amenag")) return Sofa;
  if (n.includes("traduc") || n.includes("rédac") || n.includes("redac") || n.includes("langue")) return Languages;
  if (n.includes("plomb")) return Wrench;
  if (n.includes("maison")) return Home;
  return Briefcase;
}

interface CategoryIconProps {
  name: string;
  className?: string;
}

export function CategoryIcon({ name, className = "h-6 w-6" }: CategoryIconProps) {
  const Icon = getCategoryIconComponent(name);
  return <Icon className={className} />;
}
