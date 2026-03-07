export function Background1() {
  return (
    <div className="relative w-screen min-h-screen bg-gray-50 dark:bg-gray-100 overflow-hidden">
      {/* Top Curve */}
      <svg
        className="absolute -top-10 left-0 w-full h-auto pointer-events-none"
        viewBox="0 0 1440 452"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="stroke-blue2"
          d="M-1 397.997C129.254 453.548 220.379 463.406 359.5 436.997C519.764 406.575 720 225.997 720 225.997C720 225.997 920.236 45.4197 1080.5 14.9974C1219.62 -11.4115 1310.75 -1.55335 1441 53.9974"
          strokeOpacity="0.65"
          strokeDasharray="6 6"
        />
      </svg>

      {/* Bottom Curve */}
      <svg
        className="absolute -bottom-40 right-0 w-full h-auto pointer-events-none"
        viewBox="0 0 1440 593"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1441 1C1314.36 113.878 1231.96 166.07 1080.5 229.324C945.396 285.748 720 318 720 318C720 318 494.604 350.252 359.5 406.676C208.044 469.93 125.637 522.122 -1 635"
          className="stroke-blue2"
          strokeOpacity="0.65"
          strokeDasharray="6 6"
        />
      </svg>
    </div>
  );
}
