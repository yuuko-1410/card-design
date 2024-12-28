interface EventType {
  type: EventEnum;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}
enum EventEnum {
  // 下载PDF
  DOWNLOAD_PDF = "ADD_ELEMENT"
}
export {
    EventEnum
};
export type { EventType };
