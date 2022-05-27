import React from "react";
import uiVariables from "../Util/uiVariables";

function Quote() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={uiVariables.secondColor}
        width="26"
        height="26"
        viewBox="0 0 24 24"
      >
        <path d="M12 1c-6.338 0-12 4.226-12 10.007 0 2.05.738 4.063 2.047 5.625.055 1.83-1.023 4.456-1.993 6.368 2.602-.47 6.301-1.508 7.978-2.536 9.236 2.247 15.968-3.405 15.968-9.457 0-5.812-5.701-10.007-12-10.007zm0 10.028c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028zm5 0c0 2.337-1.529 3.91-3.684 4.335l-.406-.87c.996-.375 1.637-1.587 1.637-2.493h-1.547v-4h4v3.028z" />
      </svg>
    </div>
  );
}

export default Quote;
