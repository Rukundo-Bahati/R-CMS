export interface FamilyMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: "M" | "F";
  class: "Y1" | "Y2" | "Y3" | "Parent";
  role?: "Pere" | "Mere";
}

export interface Family {
  id: string;
  name: string;
  generation: string;
  pere?: FamilyMember;
  mere?: FamilyMember;
  members: FamilyMember[];
}

export const initialFamilies: Family[] = [
  {
    id: "1",
    name: "Jonathan",
    generation: "jonathan",
    pere: {
      id: "p1",
      name: "David Jonathan",
      email: "david.jonathan@church.com",
      phone: "+1234567890",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m1",
      name: "Ruth Jonathan",
      email: "ruth.jonathan@church.com",
      phone: "+1234567891",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "j1",
        name: "Jacob Jonathan",
        email: "jacob.jonathan@church.com",
        phone: "+1234567892",
        gender: "M",
        class: "Y1",
      },
      {
        id: "j2",
        name: "Sarah Jonathan",
        email: "sarah.jonathan@church.com",
        phone: "+1234567893",
        gender: "F",
        class: "Y2",
      },
      {
        id: "j3",
        name: "Michael Jonathan",
        email: "michael.jonathan@church.com",
        phone: "+1234567894",
        gender: "M",
        class: "Y3",
      },
    ],
  },
  {
    id: "2",
    name: "Jobs",
    generation: "jobs",
    pere: {
      id: "p2",
      name: "Samuel Jobs",
      email: "samuel.jobs@church.com",
      phone: "+1234567895",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m2",
      name: "Esther Jobs",
      email: "esther.jobs@church.com",
      phone: "+1234567896",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "jo1",
        name: "Paul Jobs",
        email: "paul.jobs@church.com",
        phone: "+1234567897",
        gender: "M",
        class: "Y1",
      },
      {
        id: "jo2",
        name: "Mary Jobs",
        email: "mary.jobs@church.com",
        phone: "+1234567898",
        gender: "F",
        class: "Y1",
      },
    ],
  },
  {
    id: "3",
    name: "Stephans",
    generation: "stephans",
    pere: {
      id: "p3",
      name: "Peter Stephans",
      email: "peter.stephans@church.com",
      phone: "+1234567899",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m3",
      name: "Anna Stephans",
      email: "anna.stephans@church.com",
      phone: "+1234567800",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "st1",
        name: "John Stephans",
        email: "john.stephans@church.com",
        phone: "+1234567801",
        gender: "M",
        class: "Y2",
      },
    ],
  },
  {
    id: "4",
    name: "Daniels",
    generation: "daniels",
    pere: {
      id: "p4",
      name: "Nathaniel Daniels",
      email: "nathaniel.daniels@church.com",
      phone: "+1234567802",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m4",
      name: "Elizabeth Daniels",
      email: "elizabeth.daniels@church.com",
      phone: "+1234567803",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "d1",
        name: "Thomas Daniels",
        email: "thomas.daniels@church.com",
        phone: "+1234567804",
        gender: "M",
        class: "Y3",
      },
      {
        id: "d2",
        name: "Grace Daniels",
        email: "grace.daniels@church.com",
        phone: "+1234567805",
        gender: "F",
        class: "Y2",
      },
      {
        id: "d3",
        name: "Joseph Daniels",
        email: "joseph.daniels@church.com",
        phone: "+1234567806",
        gender: "M",
        class: "Y1",
      },
    ],
  },
  {
    id: "5",
    name: "Joseph",
    generation: "joseph",
    pere: {
      id: "p5",
      name: "Matthew Joseph",
      email: "matthew.joseph@church.com",
      phone: "+1234567807",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m5",
      name: "Hannah Joseph",
      email: "hannah.joseph@church.com",
      phone: "+1234567808",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "jo3",
        name: "Benjamin Joseph",
        email: "benjamin.joseph@church.com",
        phone: "+1234567809",
        gender: "M",
        class: "Y2",
      },
    ],
  },
  {
    id: "6",
    name: "Dorcas",
    generation: "dorcas",
    pere: {
      id: "p6",
      name: "Philip Dorcas",
      email: "philip.dorcas@church.com",
      phone: "+1234567810",
      gender: "M",
      class: "Parent",
      role: "Pere",
    },
    mere: {
      id: "m6",
      name: "Lydia Dorcas",
      email: "lydia.dorcas@church.com",
      phone: "+1234567811",
      gender: "F",
      class: "Parent",
      role: "Mere",
    },
    members: [
      {
        id: "d4",
        name: "Andrew Dorcas",
        email: "andrew.dorcas@church.com",
        phone: "+1234567812",
        gender: "M",
        class: "Y1",
      },
      {
        id: "d5",
        name: "Priscilla Dorcas",
        email: "priscilla.dorcas@church.com",
        phone: "+1234567813",
        gender: "F",
        class: "Y3",
      },
      {
        id: "d6",
        name: "Stephen Dorcas",
        email: "stephen.dorcas@church.com",
        phone: "+1234567814",
        gender: "M",
        class: "Y2",
      },
    ],
  },
];
