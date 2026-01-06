import {
  type ClientResponse,
  type ProjectResponse,
  type TaskResponse,
} from "./api";

export type SidebarProps = {
  clients: (ClientResponse | ProjectResponse | TaskResponse)[] | null;
  PageDown: () => void;
  PageUp: () => void;
  page: number;
  fetchNextLevelForData: (id: number, level: String) => void;
};

export default function SideBar(props: SidebarProps) {
  //level is important here for the hierarchy structure, level of indentation,
  //defined by css
  function identifyLevel(
    element: ClientResponse | ProjectResponse | TaskResponse
  ) {
    return "description" in element ? "1" : "clientId" in element ? "2" : "3";
  }
  //var rows: (ClientResponse | ProjectResponse | TaskResponse)[] = [];
  // if (props.clients !== null) {
  //   props.clients?.map((el) => {
  //     rows.push(el);
  //   });
  // }
  return (
    <div className="sidebar">
      {props.page > 0 ? (
        <div onClick={props.PageDown} className="treeItem">
          ^
        </div>
      ) : (
        ""
      )}
      {props.clients?.map((el) => {
        return (
          <div
            onClick={() =>
              props.fetchNextLevelForData(el.id, identifyLevel(el))
            }
            className={"treeItem level" + identifyLevel(el)}
          >
            {(identifyLevel(el) !== "1" ? "\u2514" : "") + el.name}
          </div>
        );
      })}
      <div onClick={props.PageUp} className="treeItem">
        v
      </div>
    </div>
  );
}
