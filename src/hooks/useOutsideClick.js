import { useEffect, useRef } from "react";

export function useOutSideClick(handler, listenCapturing = true) {
  let ref = useRef();

  useEffect(
    function () {
      function handleClick(e) {
        if (ref.current && !ref.current.contains(e.target)) {
          console.log("click outside");
          handler();
        }
      }
      //选择监听捕获阶段：为了解决下面的问题
      // 点击打开表单按钮后，捕获--到达event : Window出现，
      // --冒泡: 触发document点击事件--hanleClick立马被关闭了
      document.addEventListener("click", handleClick, listenCapturing);

      return () =>
        document.removeEventListener("click", handleClick, listenCapturing);
    },
    [handler, listenCapturing]
  );

  return ref;
}
