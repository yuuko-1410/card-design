import { Radio, RadioChangeEvent, Button, InputNumber, Switch } from "antd";
import { useState } from "react";
import { render } from "../utils/render";
import { EventEnum, EventType } from "../types/event";
import { EventEmitter } from "ahooks/lib/useEventEmitter";
import useLayoutStore from "../store/layout";

export default function Toolbar({ bus }: { bus: EventEmitter<EventType> }) {
  const { config, changePageInfo } = useLayoutStore();
  const [pageType, setPageType] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setPageType(e.target.value);
    changePageInfo({
      ...config,
      paperSpec: e.target.value === 1 ? "A4" : "A3",
      column: e.target.value,
    });
    render();
  };

  const updateNumberNum = (value: number | null) => {
    changePageInfo({
      ...config,
      numberColNum: value ?? 10,
    });
    // 重新渲染
    render();
  };

  const changeIdentityCode = (isIdentityCode: boolean) => {
    changePageInfo({
      ...config,
      isIdentityCode,
    });
    // 重新渲染
    render();
  };
  const changeMutalVersion = (isMutalVersion: boolean) => {
    changePageInfo({
      ...config,
      isMutalVersion,
    });
    // 重新渲染
    render();
  };
  const changeRed = (isRed: boolean) => {
    changePageInfo({
      ...config,
      isRed,
    });
    // 重新渲染
    render();
  };

  return (
    <div className="w-full h-12 bg-white flex items-center gap-4">
      <Radio.Group onChange={onChange} value={pageType}>
        <Radio value={1}>A4单栏</Radio>
        <Radio value={2}>A3双栏</Radio>
        <Radio value={3}>A3三栏</Radio>
      </Radio.Group>
      <div className="flex items-center gap-2">
        <p className="text-xs">条形码</p>
        <Switch value={config.isIdentityCode} onChange={changeIdentityCode} />
        <InputNumber
          min={1}
          max={16}
          value={config.numberColNum}
          onChange={updateNumberNum}
        />
        <p className="text-xs">AB卷</p>
        <Switch value={config.isMutalVersion} onChange={changeMutalVersion} />
        <p className="text-xs">红色</p>
        <Switch value={config.isRed} onChange={changeRed} />
      </div>
      <Button
        type="primary"
        onClick={() => bus.emit({ type: EventEnum.DOWNLOAD_PDF, data: null })}
      >
        下载PDF
      </Button>
    </div>
  );
}
