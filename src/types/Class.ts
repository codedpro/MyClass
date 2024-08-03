export interface Schedule {
  day1?: string;
  day2?: string;
  day3?: string;
  day4?: string;
  day5?: string;
  day6?: string;
  day7?: string;
}

export interface Class {
    _id: string;
    name: string;
    classID: string;
    schedule?: Schedule;
  }
  