import { useEffect } from "react";
import useLayoutStore from "../../store/layout";
import { useSize } from "ahooks";
const CardInfo = () => {
  const { config, changePageInfo } = useLayoutStore();
  const {
    title,
    precautions,
    isIdentityCode,
    isMutalVersion,
    numberColNum,
    isRed,
  } = config;

  const size = useSize(document.getElementById("#card-info"));

  useEffect(() => {
    changePageInfo({
      ...config,
      realHeight: size?.height ?? 0,
    });
    // console.log(`size`, config);
  }, [size?.height]);
  return (
    <div className="flex flex-col" id="#card-info">
      <p className="text-[24px] text-center">{title}</p>
      <div className="flex flex-wrap gap-[16px] justify-center my-4 text-xs">
        <p>学校: ____________</p>
        <p>班级: ____________</p>
        <p>姓名: ____________</p>
        <p>学号: ____________</p>
      </div>
      {/* 注意事项区 */}
      <div
        className={`min-h-64 w-full border ${
          isRed ? "border-[#ff0000]" : "border-[#000]"
        } flex text-[14px]`}
      >
        <div className="flex-1 flex flex-col">
          <div
            className={`border-b ${
              isRed ? "border-[#ff0000]" : "border-[#000000]"
            } w-full h-10 flex justify-center items-center`}
          >
            <p>注意事项</p>
          </div>
          <div
            className={`border-b ${
              isRed
                ? "border-[#ff0000] text-[#ff0000]"
                : "border-[#000] text-[#000]"
            }  w-full flex-1 p-2 space-y-2`}
          >
            {precautions.map((x) => (
              <p key={x}>{x}</p>
            ))}
          </div>
          <div className="w-full h-8 flex items-center text-[11px]">
            <div className="flex-1 h-full flex items-center space-x-4 px-4 justify-center">
              <div className="flex items-center space-x-2">
                <p>样例</p>
                <div className="w-[22px] h-[12px] border border-black bg-black"></div>
              </div>
              <div className="flex items-center space-x-2">
                <p>缺考</p>
                <div className="w-[22px] h-[12px] border border-black"></div>
              </div>
              <div className="flex items-center space-x-2">
                <p>作弊</p>
                <div className="w-[22px] h-[12px] border border-black"></div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`border-l ${
            isRed ? "border-[#ff0000]" : "border-[#000]"
          } min-w-60 flex flex-col justify-center items-center`}
        >
          {isIdentityCode ? (
            <div className="flex-1 flex justify-center items-center">
              <div
                className={`h-36 w-52 rounded-xl border border-dashed ${
                  isRed ? "border-[#ff0000]" : "border-[#000]"
                } flex justify-center items-center`}
              >
                <a>贴身份码区</a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center pt-2">
              <a>准考证号</a>
              <div className="my-2 mx-2">
                <table cellPadding={0} cellSpacing={0}>
                  <tbody>
                    <tr>
                      {Array.from({ length: numberColNum }).map((_num, i) => (
                        <th key={i}>
                          <div
                            style={{
                              borderLeftWidth: i === 0 ? 1 : 0,
                            }}
                            className={`h-6 w-6 border-y border-r ${
                              isRed ? "border-[#ff0000]" : "border-[#000]"
                            } mb-1`}
                          ></div>
                        </th>
                      ))}
                    </tr>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <tr className="text-xs font-mono text-center" key={num}>
                        {Array.from({ length: numberColNum }).map((_num, i) => (
                          <td key={i}>[ {num} ]</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {isMutalVersion ? (
            <div
              className={`h-[33px] w-full border-t ${
                isRed ? "border-[#ff0000]" : "border-[#000]"
              } text-[11px] flex px-2 items-center justify-center gap-4`}
            >
              <div className="flex items-center space-x-2">
                <p>A卷</p>
                <div className="w-[22px] h-[12px] border border-black"></div>
              </div>
              <div className="flex items-center space-x-2">
                <p>B卷</p>
                <div className="w-[22px] h-[12px] border border-black"></div>
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
