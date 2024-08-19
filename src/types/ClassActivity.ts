export interface Exercise {
    exerciseID: string;
    answer: string;
    attachedFilesUrl?: string;
  }
  
  export interface ClassExercise {
    exerciseID: string;
    title: string;
    description: string;
    attachedFilesUrl?: string;
  }
  
  export interface Student {
    studentId: string;
    score: number;
    comment?: string;
    exercises?: Exercise[];
  }
  
  export interface ClassActivity {
    _id: string;
    classId: string;
    date: string;
    time: string;
    presentEnable?: boolean;
    alert?: string;
    note?: string;
    classExercises?: ClassExercise[];
    students?: Student[];
  }