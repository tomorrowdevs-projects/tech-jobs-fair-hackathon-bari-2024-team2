import React from "react";

function ButtonComponent(props: any) {
  let type: "button" | "submit" | "reset" = props.type || "button";
  let classList = ["btn", props.classBt || "btn-primary"];
  let text = props.text || "Salva";
  const clickHandler = (event: any) => {
    props.clickButton && props.clickButton(event);
  };

  return (
    <button className={classList.join(" ")} onClick={clickHandler} type={type}>
      {props.children || text}
    </button>
  );
}

export default ButtonComponent;
