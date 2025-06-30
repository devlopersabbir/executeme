import "./styles.css";
export default function Loading() {
  return (
    <svg
      width="400"
      height="150"
      viewBox="0 0 400 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-8"
    >
      {/* Master animation cycle */}
      <animate
        id="resetCycle"
        attributeName="opacity"
        from="1"
        to="1"
        dur="6s"
        begin="0s"
        repeatCount="indefinite"
      />

      {/* Step 1: Middle - API Request Received - Paper Plane Icon */}
      <circle id="circle1" cx="200" cy="75" r="25" className="flow-circle">
        <animate
          attributeName="class"
          values="flow-circle;flow-circle active-flow-circle;flow-circle"
          dur="1s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </circle>
      <path d="M190 70 L210 75 L190 80 L195 75 Z" fill="white" opacity="0.9">
        <animateTransform
          attributeName="transform"
          type="rotate"
          values="0 200 75;360 200 75"
          dur="1s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </path>

      {/* Step 2: Top Right - Secure Temp Directory - Folder Plus Icon */}
      <circle id="circle2" cx="300" cy="35" r="25" className="flow-circle">
        <animate
          attributeName="class"
          values="flow-circle;flow-circle;flow-circle active-flow-circle;flow-circle;flow-circle"
          dur="6s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </circle>
      <g fill="white" opacity="0.9">
        <rect
          x="290"
          y="30"
          width="20"
          height="15"
          rx="2"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <rect x="292" y="27" width="4" height="3" rx="1" />
        <line
          x1="297"
          y1="37"
          x2="303"
          y2="37"
          stroke="white"
          strokeWidth="2"
        />
        <line
          x1="300"
          y1="34"
          x2="300"
          y2="40"
          stroke="white"
          strokeWidth="2"
        />
      </g>

      {/* Step 3: Top Left - Docker Container - Container Icon */}
      <circle id="circle3" cx="100" cy="35" r="25" className="flow-circle">
        <animate
          attributeName="class"
          values="flow-circle;flow-circle;flow-circle;flow-circle active-flow-circle;flow-circle"
          dur="6s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </circle>
      <g fill="white" opacity="0.9">
        <rect
          x="90"
          y="28"
          width="20"
          height="14"
          rx="2"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <line x1="92" y1="32" x2="108" y2="32" stroke="white" strokeWidth="1" />
        <line x1="92" y1="36" x2="108" y2="36" stroke="white" strokeWidth="1" />
        <circle cx="95" cy="30" r="1" fill="white" />
        <circle cx="98" cy="30" r="1" fill="white" />
        <circle cx="101" cy="30" r="1" fill="white" />
      </g>

      {/* Step 4: Bottom Right - Output & Errors - Terminal Icon */}
      <circle id="circle4" cx="300" cy="115" r="25" className="flow-circle">
        <animate
          attributeName="class"
          values="flow-circle;flow-circle;flow-circle;flow-circle;flow-circle active-flow-circle"
          dur="6s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </circle>
      <g fill="white" opacity="0.9">
        <rect
          x="290"
          y="108"
          width="20"
          height="14"
          rx="2"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M293 113 L296 115 L293 117"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        <line
          x1="298"
          y1="117"
          x2="305"
          y2="117"
          stroke="white"
          strokeWidth="1.5"
        />
      </g>

      {/* Step 5: Bottom Left - Response & Cleanup - Check Circle Icon */}
      <circle id="circle5" cx="100" cy="115" r="25" className="flow-circle">
        <animate
          attributeName="class"
          values="flow-circle;flow-circle;flow-circle;flow-circle;flow-circle;flow-circle active-flow-circle"
          dur="6s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </circle>
      <path
        d="M93 115 L98 120 L107 111"
        stroke="white"
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      >
        <animate
          attributeName="stroke-dasharray"
          values="0 20;20 0;20 0;20 0;20 0;0 20"
          dur="6s"
          begin="resetCycle.begin"
          repeatCount="indefinite"
        />
      </path>
    </svg>
  );
}
