export interface Hotel {
  name: string;
  type: string;
  location: string;
  description: string;
  features: string[];
  drawbacks: string[];
  url?: string;
  images?: string[];
}

export const hotelData: Hotel[] = [
  {
    name: "Hotel General Prague",
    type: "Boutique Luxury",
    location: "Smíchov, near the Vltava river (quiet but central)",
    url: "https://general-hotel.com/",
    images: ['hotel1.jpg', 'hotel2.jpg', 'hotel3.jpg'],
    description: "A historic building transformed into an elegant, premium boutique hotel. Known for its rich history, unique design, and outstanding personalized service.",
    features: [
      "Historic building from 1890 with preserved architectural details",
      "Elegant, classical design with luxurious modern amenities",
      "Gourmet breakfast included with extensive made-to-order options",
      "Excellent, highly personalized 24/7 concierge service",
      "Quiet, family/club-style hotel",
      "Luxurious bedding and spacious premium bathrooms",
      "Welcome drink and VIP treatment for all guests",
      "Rare feature: One of only 3 hotels in Prague with an EV (Electric Vehicle) charging station",
      "Offers 24/7 autonomous/contactless check-in (guests receive access codes, arrive anytime, remote reception always available)",
      "Fast, 2-click booking process",
      "The hotel's official website has a 'Wheel of Fortune' where guests win prizes (promo codes, discounts, free parking)",
      "Special 'super price' options are located at the bottom of the hotel's official site"
    ],
    drawbacks: []
  },
  {
    name: "Hotel Olympik",
    type: "Mass-market, Mid-tier",
    location: "Karlín/Invalidovna (further from historic center)",
    description: "A large, older, mass-market hotel catering to big tourist groups with basic amenities.",
    features: [
      "Basic standard rooms",
      "On-site restaurant",
      "Close to a metro stop",
      "Large capacity"
    ],
    drawbacks: [
      "Huge and feels like a dated mass-market conveyor",
      "Requires transport to reach the historic center",
      "It is a very large, busy property"
    ]
  },
  {
    name: "Corinthia Hotel Prague",
    type: "High-rise Luxury",
    location: "Vyšehrad",
    description: "A tall, modern hotel located on a hill offering panoramic views of the city.",
    features: [
      "Top-floor spa and swimming pool with spectacular views",
      "Modern, well-equipped rooms",
      "Several restaurants and bars",
      "Directly next to a metro station"
    ],
    drawbacks: [
      "Requires a metro ride to reach the historic center (not walkable for most)",
      "Exterior design feels a bit dated",
      "Surrounding area lacks traditional Prague charm"
    ]
  }
];
