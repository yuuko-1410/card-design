import { Radio, RadioChangeEvent, Button, InputNumber, Switch } from "antd";
import { usePageStore } from "../store/page";
import { useState } from "react";
import { EventEnum, EventType } from "../types/event";
import { EventEmitter } from "ahooks/lib/useEventEmitter";
import { changeCNGridRows, render } from "../utils/processor";

export default function Toolbar({ bus }: { bus: EventEmitter<EventType> }) {
  const { config, changeConfig } = usePageStore();
  const [pageType, setPageType] = useState(1);

  const onChange = (e: RadioChangeEvent) => {
    setPageType(e.target.value);
    changeConfig({
      ...config,
      column_num: e.target.value,
    });
    changeCNGridRows(e.target.value);
    render();
  };

  const updateNumberNum = (number_digits: number | null) => {
    changeConfig({
      ...config,
      number_digits: number_digits ?? 10,
    });
    // 重新渲染
    render();
  };

  const changeIdentityCode = (is_bar_code: boolean) => {
    changeConfig({
      ...config,
      is_bar_code,
    });
    // 重新渲染
    render();
  };
  const changeMutalVersion = (is_ab: boolean) => {
    changeConfig({
      ...config,
      is_ab,
    });
    // 重新渲染
    render();
  };
  const changeRed = (is_red: boolean) => {
    changeConfig({
      ...config,
      is_red,
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
        <Switch value={config.is_bar_code} onChange={changeIdentityCode} />
        <InputNumber
          min={1}
          max={16}
          value={config.number_digits}
          onChange={updateNumberNum}
        />
        <p className="text-xs">AB卷</p>
        <Switch value={config.is_ab} onChange={changeMutalVersion} />
        <p className="text-xs">红色</p>
        <Switch value={config.is_red} onChange={changeRed} />
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
