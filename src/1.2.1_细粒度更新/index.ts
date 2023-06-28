import { useState, useEffect, useMemo } from "./hooks";

const [name1, setName1] = useState("Li Lei");
const [name2, setName2] = useState("Han Mei Mei");
const [showAll, setShowAll] = useState(true);

const whoIsHere = useMemo(() => {
  if (!showAll()) {
    return name1();
  }

  return `${name1()} & ${name2()}`;
});

useEffect(() => {
  return console.log(`Who is here, is ${whoIsHere()}`);
});

setName1("Xiao Ming"); //

setShowAll(false);

setName2("Xiao Hong");

/**
 * 预期结果
 * 1、useEffect立即执行一次: Who is here, is Li Lei & Han Mei Mei
 * 2、修改name1： Who is here, is Xiao Ming & Han Mei Mei
 * 3、修改showAll: Who is here, is Xiao Ming
 * 4、修改name2: whoIsHere不变，没有输出
 */
