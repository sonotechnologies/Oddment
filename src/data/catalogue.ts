/**
 * The Oddment catalogue. Single source of truth, shared by the database seed
 * and the Pexels image fetcher so slugs and search queries can never drift.
 */

export type CategoryKey = "WOMEN" | "MEN" | "ACCESSORIES";

export type CatalogueProduct = {
  slug: string;
  name: string;
  category: CategoryKey;
  pricePence: number;
  description: string;
  imageQuery: string;
  isNewIn?: boolean;
  staffNote?: string;
  staffNoteAuthor?: string;
};

export const WOMENS_SIZES = ["6", "8", "10", "12", "14", "16", "18"];
export const MENS_SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
export const ACCESSORY_SIZES = ["One size"];

export function sizesFor(category: CategoryKey): string[] {
  if (category === "WOMEN") return WOMENS_SIZES;
  if (category === "MEN") return MENS_SIZES;
  return ACCESSORY_SIZES;
}

export const CATALOGUE: CatalogueProduct[] = [
  {
    slug: "linen-wrap-dress",
    name: "Linen Wrap Dress",
    category: "WOMEN",
    pricePence: 6800,
    description:
      "Washed European linen that creases in all the right ways and softens every time you wash it. A proper wrap, so it actually fits where you need it to.",
    imageQuery: "linen wrap dress woman",
    isNewIn: true,
  },
  {
    slug: "ribbed-knit-midi-dress",
    name: "Ribbed Knit Midi Dress",
    category: "WOMEN",
    pricePence: 7200,
    description:
      "A fine rib that skims rather than clings, cut long enough to wear with boots all winter. The sort of dress that quietly does three seasons.",
    imageQuery: "ribbed knit dress",
  },
  {
    slug: "chunky-cable-cardigan",
    name: "Chunky Cable Cardigan",
    category: "WOMEN",
    pricePence: 6400,
    description:
      "Hand-framed cables in a lambswool blend, with a generous body and horn-look buttons. Heavy in the way a good cardigan should be.",
    imageQuery: "cable knit cardigan woman",
    staffNote: "I've worn mine to death and it still looks new",
    staffNoteAuthor: "Sam",
  },
  {
    slug: "merino-crew-jumper",
    name: "Merino Crew Jumper",
    category: "WOMEN",
    pricePence: 5800,
    description:
      "Fine-gauge merino, soft enough against the skin to wear on its own. Neat at the shoulder so it sits well under a coat.",
    imageQuery: "merino sweater woman",
  },
  {
    slug: "oversized-cotton-shirt",
    name: "Oversized Cotton Shirt",
    category: "WOMEN",
    pricePence: 4500,
    description:
      "Crisp cotton poplin cut deliberately roomy, with a dropped shoulder and a long tail. Wear it open over a tee or buttoned to the top.",
    imageQuery: "oversized white shirt woman",
  },
  {
    slug: "printed-blouse",
    name: "Printed Blouse",
    category: "WOMEN",
    pricePence: 4800,
    description:
      "A small-scale print on soft viscose, gathered lightly at the cuff. One of those pieces that makes jeans look considered.",
    imageQuery: "printed blouse woman",
    isNewIn: true,
  },
  {
    slug: "wide-leg-tailored-trousers",
    name: "Wide-leg Tailored Trousers",
    category: "WOMEN",
    pricePence: 5500,
    description:
      "A clean high waist and a proper wide leg that holds its line. Pressed creases if you want them, none if you don't.",
    imageQuery: "wide leg trousers woman",
  },
  {
    slug: "straight-leg-cord-trousers",
    name: "Straight-leg Cord Trousers",
    category: "WOMEN",
    pricePence: 5200,
    description:
      "Mid-wale cotton corduroy with just enough give to sit comfortably all day. The colour deepens beautifully after a wash or two.",
    imageQuery: "corduroy trousers woman",
  },
  {
    slug: "wool-blend-longline-coat",
    name: "Wool-blend Longline Coat",
    category: "WOMEN",
    pricePence: 12000,
    description:
      "Falls below the knee, with a half lining and deep welt pockets. Warm without the weight, which is most of the battle in Manchester.",
    imageQuery: "long wool coat woman",
    staffNote: "The one I'd save up for — it makes everything look smarter",
    staffNoteAuthor: "Sam",
  },
  {
    slug: "quilted-liner-jacket",
    name: "Quilted Liner Jacket",
    category: "WOMEN",
    pricePence: 7800,
    description:
      "Light diamond quilting with a soft collar, sized to layer under a bigger coat. Good for the fortnight either side of proper winter.",
    imageQuery: "quilted jacket woman",
  },
  {
    slug: "boxy-striped-tee",
    name: "Boxy Striped Tee",
    category: "WOMEN",
    pricePence: 2400,
    description:
      "Heavyweight organic cotton in a clean boxy cut that keeps its shape. The stripe is woven, not printed, so it won't fade oddly.",
    imageQuery: "striped t-shirt woman",
  },
  {
    slug: "pleated-midi-skirt",
    name: "Pleated Midi Skirt",
    category: "WOMEN",
    pricePence: 5000,
    description:
      "Knife pleats in a fabric with real movement, on a flat waistband that sits neatly. Swings properly when you walk.",
    imageQuery: "pleated midi skirt",
    isNewIn: true,
  },
  {
    slug: "oxford-button-down-shirt",
    name: "Oxford Button-down Shirt",
    category: "MEN",
    pricePence: 4800,
    description:
      "Proper heavy oxford cloth with a soft roll to the collar. Stiff for the first week, then it's yours for years.",
    imageQuery: "oxford shirt man",
  },
  {
    slug: "heavyweight-overshirt",
    name: "Heavyweight Overshirt",
    category: "MEN",
    pricePence: 6500,
    description:
      "Brushed cotton with patch pockets and corozo buttons, cut to go over a knit without bunching. A jacket that pretends to be a shirt.",
    imageQuery: "overshirt man",
    staffNote: "Goes with everything I own, which is the whole point",
    staffNoteAuthor: "Rob",
  },
  {
    slug: "lambswool-crew-jumper",
    name: "Lambswool Crew Jumper",
    category: "MEN",
    pricePence: 6200,
    description:
      "Mid-weight lambswool with a close-ribbed cuff and hem. Sits neatly under the overshirt without adding bulk.",
    imageQuery: "wool sweater man",
  },
  {
    slug: "fisherman-roll-neck",
    name: "Fisherman Roll-neck",
    category: "MEN",
    pricePence: 7000,
    description:
      "Chunky rope cables and a roll-neck that stands up on its own. Built for standing about on a cold platform.",
    imageQuery: "fisherman sweater man",
    isNewIn: true,
  },
  {
    slug: "relaxed-chinos",
    name: "Relaxed Chinos",
    category: "MEN",
    pricePence: 5500,
    description:
      "Cotton twill with a touch of weight, cut easy through the thigh and tapered gently. Smart enough for work, soft enough for Sunday.",
    imageQuery: "chinos man",
  },
  {
    slug: "wide-cord-trousers",
    name: "Wide Cord Trousers",
    category: "MEN",
    pricePence: 5800,
    description:
      "Eight-wale cotton cord with a generous straight leg. Wears in at the knee in a way we consider a feature.",
    imageQuery: "corduroy trousers man",
  },
  {
    slug: "waxed-cotton-jacket",
    name: "Waxed Cotton Jacket",
    category: "MEN",
    pricePence: 11500,
    description:
      "Proper waxed cotton with a corduroy collar and storm cuffs. Rewaxable, so it should outlast several winters of drizzle.",
    imageQuery: "waxed jacket man",
  },
  {
    slug: "chore-jacket",
    name: "Chore Jacket",
    category: "MEN",
    pricePence: 8500,
    description:
      "Three pockets, unlined, in a hard-wearing cotton drill that fades at the seams. The one thing we reorder every autumn.",
    imageQuery: "chore jacket workwear",
    staffNote: "Buy it, wear it for ten years, thank me later",
    staffNoteAuthor: "Rob",
  },
  {
    slug: "heavyweight-pocket-tee",
    name: "Heavyweight Pocket Tee",
    category: "MEN",
    pricePence: 2600,
    description:
      "Thick organic cotton that hangs properly instead of clinging. The pocket is stitched to survive the washing machine.",
    imageQuery: "plain t-shirt man",
  },
  {
    slug: "striped-breton-top",
    name: "Striped Breton Top",
    category: "MEN",
    pricePence: 3200,
    description:
      "The genuine article — dense cotton jersey, boat neck, three-quarter sleeve. Gets better looking the more it's washed.",
    imageQuery: "breton stripe top",
  },
  {
    slug: "knitted-polo",
    name: "Knitted Polo",
    category: "MEN",
    pricePence: 4800,
    description:
      "A soft open-knit polo with a relaxed collar that sits flat. Works with tailoring or with shorts, which is a rare trick.",
    imageQuery: "knitted polo shirt",
    isNewIn: true,
  },
  {
    slug: "harrington-jacket",
    name: "Harrington Jacket",
    category: "MEN",
    pricePence: 9500,
    description:
      "Classic short blouson with a knitted collar and a checked lining. Cut close but not tight, the way it should be.",
    imageQuery: "harrington jacket",
  },
  {
    slug: "leather-crossbody-bag",
    name: "Leather Crossbody Bag",
    category: "ACCESSORIES",
    pricePence: 6500,
    description:
      "Full-grain leather with solid hardware and an adjustable strap. Holds a phone, a purse and a paperback, and nothing you don't need.",
    imageQuery: "leather crossbody bag",
    staffNote: "Mine's three years old and has gone a lovely colour",
    staffNoteAuthor: "Nia",
  },
  {
    slug: "canvas-tote",
    name: "Canvas Tote",
    category: "ACCESSORIES",
    pricePence: 2200,
    description:
      "Heavy unbleached cotton canvas with reinforced handles and a flat base. Stands up on the floor, which we appreciate more than we expected.",
    imageQuery: "canvas tote bag",
  },
  {
    slug: "lambswool-scarf",
    name: "Lambswool Scarf",
    category: "ACCESSORIES",
    pricePence: 3000,
    description:
      "Woven in Hawick and fringed by hand, in a weight that works from October to April. Soft enough to wear against the neck.",
    imageQuery: "wool scarf",
  },
  {
    slug: "rib-beanie",
    name: "Rib Beanie",
    category: "ACCESSORIES",
    pricePence: 2000,
    description:
      "A close rib with a deep turn-back, so it covers your ears properly. Wool blend, so it keeps its shape.",
    imageQuery: "knit beanie",
    isNewIn: true,
  },
  {
    slug: "cotton-bucket-hat",
    name: "Cotton Bucket Hat",
    category: "ACCESSORIES",
    pricePence: 2400,
    description:
      "Washed cotton twill with a brim that holds its shape but packs flat. Genuinely useful in a Manchester summer.",
    imageQuery: "bucket hat",
  },
  {
    slug: "gold-tone-hoop-earrings",
    name: "Gold-tone Hoop Earrings",
    category: "ACCESSORIES",
    pricePence: 1800,
    description:
      "A mid-size hoop, light enough to forget you're wearing. Gold-tone over brass with sterling posts.",
    imageQuery: "gold hoop earrings",
  },
  {
    slug: "fine-chain-necklace",
    name: "Fine Chain Necklace",
    category: "ACCESSORIES",
    pricePence: 2200,
    description:
      "A delicate chain that sits just below the collarbone and layers well with others. Quietly there rather than shouting.",
    imageQuery: "gold chain necklace",
  },
  {
    slug: "leather-belt",
    name: "Leather Belt",
    category: "ACCESSORIES",
    pricePence: 3200,
    description:
      "English bridle leather with a solid brass buckle, hand-stitched at the keeper. It will outlast the trousers.",
    imageQuery: "leather belt",
  },
  {
    slug: "silk-neck-scarf",
    name: "Silk Neck Scarf",
    category: "ACCESSORIES",
    pricePence: 2600,
    description:
      "A small square of proper silk with hand-rolled edges. Round the neck, on a bag handle, or tying your hair back.",
    imageQuery: "silk neck scarf",
  },
  {
    slug: "leather-card-holder",
    name: "Leather Card Holder",
    category: "ACCESSORIES",
    pricePence: 2000,
    description:
      "Four slots and a centre pocket in vegetable-tanned leather. Slim enough for a back pocket, smart enough to hand over.",
    imageQuery: "leather card holder",
  },
];
