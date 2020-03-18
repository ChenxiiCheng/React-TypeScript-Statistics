declare namespace responseResult {
  interface CourseItem {
    title: string;
    count: number;
  }

  interface DataStructure {
    [key: string]: CourseItem[];
  }
  type isLogin = boolean;
  type login = boolean;
  type logout = boolean;
  type getData = boolean;
  type showData = boolean | DataStructure;
}
