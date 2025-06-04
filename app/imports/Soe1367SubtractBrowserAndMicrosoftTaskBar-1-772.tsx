import svgPaths from "./svg-kfixgbt5mm";
import clsx from "clsx";

function Wrapper9({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative w-full">
        {children}
      </div>
    </div>
  );
}

function Wrapper7({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="basis-0 grow min-h-px min-w-px relative shrink-0">
      <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative w-full">
        {children}
      </div>
    </div>
  );
}

function Wrapper5({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="relative shrink-0 size-6">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 24 24"
      >
        {children}
      </svg>
    </div>
  );
}

function Wrapper3({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className="flex flex-row items-center justify-center relative size-full">
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[8px] relative">
        {children}
      </div>
    </div>
  );
}
type Wrapper1Props = {
  additionalClassNames?: string[];
};

function Wrapper1({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<Wrapper1Props>) {
  return (
    <div
      className={clsx(
        "absolute bg-[#f8f8f8] left-[311px] w-[744px]",
        additionalClassNames,
      )}
    >
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-4 items-center justify-center p-[16px] relative w-[744px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function Wrapper({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper3>
      <div className="css-xb0uby font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">{children}</p>
      </div>
    </Wrapper3>
  );
}

function Delete() {
  return (
    <Wrapper5>
      <g id="delete">
        <path d={svgPaths.p293a070} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper5>
  );
}

function Designlayoutgrid() {
  return (
    <Wrapper5>
      <g id="Design/Layout Grid">
        <g id="Vector">
          <path
            clipRule="evenodd"
            d={svgPaths.p3d435ef0}
            fill="var(--fill-0, #212529)"
            fillRule="evenodd"
          />
          <path
            clipRule="evenodd"
            d={svgPaths.p3d435ef0}
            fill="var(--fill-1, black)"
            fillOpacity="0.2"
            fillRule="evenodd"
          />
        </g>
      </g>
    </Wrapper5>
  );
}

function Libraryadd() {
  return (
    <Wrapper5>
      <g id="library_add">
        <path d={svgPaths.p3c7c2c80} fill="var(--fill-0, black)" id="Vector" />
      </g>
    </Wrapper5>
  );
}
type Text5Props = {
  text: string;
};

function Text5({ text }: Text5Props) {
  return <Wrapper>{text}</Wrapper>;
}
type Text3Props = {
  text: string;
};

function Text3({ text }: Text3Props) {
  return (
    <div className="bg-[#263238] relative rounded-sm shrink-0">
      <Text5 text={text} />
    </div>
  );
}
type Text2Props = {
  text: string;
};

function Text2({ text }: Text2Props) {
  return (
    <div className="relative shrink-0">
      <div className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative">
        <Radiobuttonunchecked />
        <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
          <p className="block leading-[normal] whitespace-pre">{text}</p>
        </div>
      </div>
    </div>
  );
}

function Radiobuttonunchecked() {
  return (
    <div className="relative shrink-0 size-5">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 20 20"
      >
        <g id="radio_button_unchecked">
          <path
            d={svgPaths.p34103500}
            fill="var(--fill-0, black)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <Wrapper3>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">{text}</p>
      </div>
    </Wrapper3>
  );
}
type TextProps = {
  text: string;
};

function Text({ text }: TextProps) {
  return (
    <div className="relative shrink-0">
      <Text1 text={text} />
    </div>
  );
}

function Frame11487() {
  return (
    <div className="bg-[#ffffff] relative shrink-0">
      <div className="absolute border-[#000000] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Text1 text="Add fields" />
    </div>
  );
}

function Frame11490() {
  return (
    <div className="absolute left-1/2 top-5 translate-x-[-50%]">
      <div className="box-border content-stretch flex flex-row items-center justify-start p-0 relative">
        <Text text="Select audience" />
        <Frame11487 />
        <Text text="View responses" />
        <Text text="Add collaborators" />
      </div>
    </div>
  );
}

function Frame11521() {
  return (
    <Wrapper7>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal h-5 leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left w-[712px]">
        <p className="leading-[normal]">
          <span>{`Did you attend the `}</span>
          <span className="font-['Chalkboard:Bold',_sans-serif] font-bold not-italic">
            June 2025 Leadership camp
          </span>
          <span>{`? `}</span>
        </p>
      </div>
      <Text2 text="Yes" />
      <Text2 text="No" />
    </Wrapper7>
  );
}

function Frame11524() {
  return (
    <Wrapper9>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
        <ol className="list-decimal" start="1">
          <li className="css-36dmrd mb-0 ms-6">
            <span className="leading-[normal] text-[16px]">&nbsp;</span>
          </li>
        </ol>
      </div>
      <Frame11521 />
    </Wrapper9>
  );
}

function Frame11525() {
  return (
    <Wrapper7>
      <div
        className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[14px] text-left"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[normal]">Multiple Choice</p>
      </div>
      <Frame11524 />
    </Wrapper7>
  );
}

function Frame11527() {
  return (
    <Wrapper1 additionalClassNames={["top-[180.16px]"]}>
      <Frame11525 />
      <Text3 text="Edit" />
      <Libraryadd />
      <Designlayoutgrid />
      <Delete />
    </Wrapper1>
  );
}

function Frame11528() {
  return (
    <div className="bg-[#ffffff] relative rounded-sm shrink-0 w-full">
      <div className="absolute border border-[#000000] border-solid inset-0 pointer-events-none rounded-sm" />
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-4 py-2 relative w-full">
          <div className="basis-0 css-gc7wi5 font-['Chalkboard:Regular',_sans-serif] font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-[rgba(0,0,0,0.41)] text-left">
            <p className="block leading-[normal]">Start typing...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame11526() {
  return (
    <div className="relative shrink-0 w-full">
      <div className="box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative w-full">
        <Frame11528 />
        <div
          className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[14px] text-right"
          style={{ width: "min-content" }}
        >
          <p className="block leading-[normal]">0/100</p>
        </div>
      </div>
    </div>
  );
}

function Frame11529() {
  return (
    <Wrapper7>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal h-5 leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left w-[712px]">
        <p className="block leading-[normal]">
          Please share your learnings here:
        </p>
      </div>
      <Frame11526 />
    </Wrapper7>
  );
}

function Frame11530() {
  return (
    <Wrapper9>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
        <ol className="list-decimal" start="2">
          <li className="css-36dmrd mb-0 ms-6">
            <span className="leading-[normal] text-[16px]">&nbsp;</span>
          </li>
        </ol>
      </div>
      <Frame11529 />
    </Wrapper9>
  );
}

function Frame11531() {
  return (
    <Wrapper7>
      <div
        className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] min-w-full not-italic relative shrink-0 text-[#000000] text-[14px] text-left"
        style={{ width: "min-content" }}
      >
        <p className="block leading-[normal]">Free text</p>
      </div>
      <Frame11530 />
    </Wrapper7>
  );
}

function Frame11522() {
  return (
    <Wrapper1 additionalClassNames={["top-[330.16px]"]}>
      <Frame11531 />
      <Text3 text="Edit" />
      <Libraryadd />
      <Designlayoutgrid />
      <Delete />
    </Wrapper1>
  );
}

function Frame11533() {
  return (
    <div className="absolute bg-[#263238] left-1/2 rounded-sm top-[521px] translate-x-[-50%]">
      <Text5 text="Add field" />
    </div>
  );
}

function Frame11494() {
  return (
    <div className="absolute left-[939.297px] rounded-sm top-[72px]">
      <div className="absolute border border-[#000000] border-solid inset-0 pointer-events-none rounded-sm" />
      <Text1 text="Preview" />
    </div>
  );
}

function Frame11493() {
  return (
    <div className="absolute bg-[#263238] left-[1019.3px] rounded-sm top-[72px]">
      <Wrapper>{`Publish & Share`}</Wrapper>
    </div>
  );
}

function Frame11485() {
  return (
    <div className="absolute bg-[#d9d9d9] left-[215.297px] rounded-sm top-[72px]">
      <div className="flex flex-row items-center justify-center relative size-full">
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-2 py-1 relative">
          <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
            <p className="block leading-[normal] whitespace-pre">Unpublished</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Soe1367SubtractBrowserAndMicrosoftTaskBar() {
  return (
    <div
      className="bg-[#ffffff] relative size-full"
      data-name="SOE / 1367 (subtract browser and microsoft task bar)"
    >
      <div className="absolute css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] left-[119px] not-italic text-[#000000] text-[18px] text-left text-nowrap top-[14.336px]">
        <p className="block leading-[26px] whitespace-pre">Survey Builder for Teachers</p>
      </div>
      <div className="absolute css-iiw2qh font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] left-[1182px] not-italic text-[#111111] text-[18px] text-left text-nowrap top-[14.336px]">
        <p className="block leading-[26px] whitespace-pre">User ID</p>
      </div>
      <Frame11490 />
      <div className="absolute bottom-[92.661%] left-0 right-0 top-[7.339%]">
        <div className="absolute bottom-[-1px] left-0 right-0 top-[-1px]">
          <svg
            className="block size-full"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 1366 2"
          >
            <path
              d="M0 1H1366"
              id="Vector 10"
              stroke="var(--stroke-0, #AAAAAA)"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
      <Frame11527 />
      <Frame11522 />
      <Frame11533 />
      <div className="absolute bg-[#f0f0f0] h-[100.664px] left-[0.297px] top-14 w-[1366px]" />
      <Frame11494 />
      <Frame11493 />
      <Frame11485 />
      <div className="absolute css-yqdygo font-['Chalkboard:Bold',_sans-serif] font-bold leading-[0] left-[215.297px] not-italic text-[#000000] text-[24px] text-left text-nowrap top-[106px]">
        <p className="block leading-[normal] whitespace-pre">
          Feedback form title
        </p>
      </div>
    </div>
  );
}