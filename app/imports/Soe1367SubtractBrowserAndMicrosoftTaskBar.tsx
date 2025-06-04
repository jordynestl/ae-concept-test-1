import clsx from "clsx";
type Wrapper3Props = {
  additionalClassNames?: string[];
};

function Wrapper3({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<Wrapper3Props>) {
  return (
    <div
      className={clsx(
        "flex items-center justify-center relative size-full",
        additionalClassNames,
      )}
    >
      {children}
    </div>
  );
}

function Wrapper2({ children }: React.PropsWithChildren<{}>) {
  return (
    <Wrapper3 additionalClassNames={["flex-row"]}>
      <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center p-[8px] relative">
        {children}
      </div>
    </Wrapper3>
  );
}
type WrapperProps = {
  additionalClassNames?: string[];
};

function Wrapper({
  children,
  additionalClassNames = [],
}: React.PropsWithChildren<WrapperProps>) {
  return (
    <div className={clsx("bg-[#263238] rounded-sm", additionalClassNames)}>
      <Wrapper2>
        <div className="css-xb0uby font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-left text-nowrap">
          <p className="block leading-[normal] whitespace-pre">{children}</p>
        </div>
      </Wrapper2>
    </div>
  );
}
type Text1Props = {
  text: string;
};

function Text1({ text }: Text1Props) {
  return (
    <Wrapper2>
      <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
        <p className="block leading-[normal] whitespace-pre">{text}</p>
      </div>
    </Wrapper2>
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

function Frame11493() {
  return (
    <Wrapper additionalClassNames={["relative", "shrink-0"]}>Add field</Wrapper>
  );
}

function Frame11491() {
  return (
    <div className="relative shrink-0 w-full">
      <Wrapper3 additionalClassNames={["flex-col"]}>
        <div className="box-border content-stretch flex flex-col gap-2 items-center justify-center p-[8px] relative w-full">
          <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[16px] text-left text-nowrap">
            <p className="block leading-[normal] whitespace-pre">
              No questions/fields added yet
            </p>
          </div>
          <Frame11493 />
        </div>
      </Wrapper3>
    </div>
  );
}

function Frame11492() {
  return (
    <div className="absolute bg-[#f8f8f8] left-[319px] top-[172.664px] w-[744px]">
      <div className="relative size-full">
        <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-[8px] relative w-[744px]">
          <Frame11491 />
        </div>
      </div>
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

function Frame11494() {
  return (
    <div className="absolute left-[939.297px] rounded-sm top-[72px]">
      <div className="absolute border border-[#000000] border-solid inset-0 pointer-events-none rounded-sm" />
      <Text1 text="Preview" />
    </div>
  );
}

function Frame11495() {
  return (
    <Wrapper
      additionalClassNames={["absolute", "left-[1019.3px]", "top-[72px]"]}
    >{`Publish & Share`}</Wrapper>
  );
}

function Frame11485() {
  return (
    <div className="absolute bg-[#d9d9d9] left-[215.297px] rounded-sm top-[72px]">
      <Wrapper3 additionalClassNames={["flex-row"]}>
        <div className="box-border content-stretch flex flex-row gap-2 items-center justify-center px-2 py-1 relative">
          <div className="css-yqdygo font-['Chalkboard:Regular',_sans-serif] font-normal leading-[0] not-italic relative shrink-0 text-[#000000] text-[14px] text-left text-nowrap">
            <p className="block leading-[normal] whitespace-pre">Unpublished</p>
          </div>
        </div>
      </Wrapper3>
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
      <Frame11492 />
      <Frame11490 />
      <div className="absolute bg-[#f0f0f0] h-[100.664px] left-[0.297px] top-14 w-[1366px]" />
      <Frame11494 />
      <Frame11495 />
      <Frame11485 />
      <div className="absolute css-yqdygo font-['Chalkboard:Bold',_sans-serif] font-bold leading-[0] left-[215.297px] not-italic text-[#000000] text-[24px] text-left text-nowrap top-[106px]">
        <p className="block leading-[normal] whitespace-pre">
          Feedback form title
        </p>
      </div>
    </div>
  );
}