export interface CustomerOrder {
  seaweedType: string;
  localName: string;
  quantity: number;
  malaysianPurpose: string;
  status: 'pending' | 'completed';
  requiredQuality: 'A' | 'B' | 'C';
}

export interface Customer {
  id: number;
  name: string;
  location: string;
  orders: CustomerOrder[];
  dialogue: string;
}

export const customers: Customer[] = [
  {
    id: 1,
    name: "Mak Cik Kiah",
    location: "Terengganu",
    dialogue: "Saya perlukan Sanggai untuk keropok lekor!",
    orders: [
      { 
        seaweedType: "Eucheuma Cottonii",
        localName: "Sanggai",
        quantity: 3,
        malaysianPurpose: "Keropok Lekor",
        status: "pending",
        requiredQuality: 'A'
      },
      {
        seaweedType: "Gracilaria Changii",
        localName: "Rumpai Laut Merah", 
        quantity: 2,
        malaysianPurpose: "Agar-Agar Santan",
        status: "pending",
        requiredQuality: 'B'
      }
    ]
  },
  {
    id: 2,
    name: "Pak Mat",
    location: "Sabah",
    dialogue: "Beri saya Latok untuk urap tradisi!",
    orders: [
      {
        seaweedType: "Caulerpa Lentillifera",
        localName: "Latok",
        quantity: 4,
        malaysianPurpose: "Urap Laut",
        status: "pending", 
        requiredQuality: 'C'
      }
    ]
  }
];
