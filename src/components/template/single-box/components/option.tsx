interface SingleBoxOptionProps {
  qno: number;
  type?: "single" | "multiple" | "judge";
  style?: "fill" | "hollow";
  optionNum?: number;
}
const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const judges = ["Y", "N"];

const SingleBoxOption = ({
  qno,
  type = "single",
  optionNum = 4,
  style = "hollow",
}: SingleBoxOptionProps) => {
  return (
    <div className="flex gap-1 items-center font-mono">
      <label>{`${qno}`.padStart(2, "0")}</label>
      {type == "judge" ? (
        <>
          {judges.map((j) =>
            style == "hollow" ? (
              <div
                className="w-[28px] h-[16px] text-sm flex justify-center items-center"
                key={j}
              >
                [ {j} ]
              </div>
            ) : (
              <div
                className="w-[28px] h-[16px] border border-black text-sm flex justify-center items-center"
                key={j}
              >
                {j}
              </div>
            )
          )}
        </>
      ) : (
        <>
          {letters.slice(0, optionNum).map((l) =>
            style == "hollow" ? (
              <div
                className="w-[28px] h-[16px] text-sm flex justify-center items-center"
                key={l}
              >
                [ {l} ]
              </div>
            ) : (
              <div
                className="w-[28px] h-[16px] border border-black text-sm flex justify-center items-center"
                key={l}
              >
                {l}
              </div>
            )
          )}
        </>
      )}
    </div>
  );
};
export default SingleBoxOption;
