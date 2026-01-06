import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import {
  getClients,
  getProjects,
  getTasks,
  getTimeEntries,
  createTimeEntries,
  updateTimeEntries,
  type ClientResponse,
  type ProjectResponse,
  type TaskResponse,
  type TimeEntryResponse,
  type TimeEntryRequest,
} from "./api";
import SideBar from "./SideBar";
import TimeEntry from "./TimeEntry";

export default function App() {
  const [sidebarData, setSidebarData] = useState<
    (ClientResponse | ProjectResponse | TaskResponse)[] | null
  >(null);
  const [clientsPage, setClientsPage] = useState<number>(0);
  const [timeEntryData, setTimeEntryData] = useState<TimeEntryResponse[]>([]);
  const [timeEntryPage, setTimeEntryPage] = useState<number>(0);

  //fetches only clients at first
  useEffect(() => {
    getClients(clientsPage)
      .then((d) => {
        setSidebarData(d);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }, [clientsPage]);

  //fetches time entries on load
  useEffect(() => {
    getTimeEntries(timeEntryPage)
      .then((d) => {
        setTimeEntryData(d);
      })
      .catch((e: unknown) => {
        toast.error(e instanceof Error ? e.message : String(e));
      });
  }, [timeEntryPage]);

  function editTimeEntry(te: TimeEntryRequest, id?: number) {
    if (!id) {
      createTimeEntries(te)
        .then(() => {
          toast.success("new time entry created");
        })
        .catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : String(e));
        });
    } else {
      updateTimeEntries(te, id)
        .then(() => {
          toast.success("time entry updated");
        })
        .catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : String(e));
        });
    }
  }

  //level dictates what type of data it is here - client, project, or task
  function fetchNextLevelForData(id: number, level: String) {
    if (level === "1") {
      getProjects(id)
        .then((d) => {
          //if the data has not been retrieved yet
          if (
            sidebarData?.findIndex(
              (el) => el.id == d[0].id && "clientId" in el
            ) == -1
          ) {
            //find the project whose children were fetched
            //take the current dataset up to it, then add the newly fetched data,
            // then add the rest of the data - ensuring the desired structure
            setSidebarData(
              sidebarData
                ?.slice(
                  0,
                  sidebarData?.findIndex(
                    (el) => el.id == id && "description" in el
                  ) + 1
                )
                .concat(d)
                .concat(
                  sidebarData?.slice(
                    sidebarData?.findIndex(
                      (el) => el.id == id && "description" in el
                    ) + 1
                  )
                ) ?? null
            );
          }
        })
        .catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : String(e));
        });
    }
    //same as above for fetching tasks
    if (level === "2") {
      getTasks(id)
        .then((d) => {
          if (
            sidebarData?.findIndex(
              (el) =>
                el.id == d[0].id &&
                !("description" in el) &&
                !("clientId" in el)
            ) == -1
          ) {
            setSidebarData(
              sidebarData
                ?.slice(
                  0,
                  sidebarData?.findIndex(
                    (el) => el.id == id && "clientId" in el
                  ) + 1
                )
                .concat(d)
                .concat(
                  sidebarData?.slice(
                    sidebarData?.findIndex(
                      (el) => el.id == id && "clientId" in el
                    ) + 1
                  )
                ) ?? null
            );
          }
        })
        .catch((e: unknown) => {
          toast.error(e instanceof Error ? e.message : String(e));
        });
    }
  }

  return (
    <div className="app">
      <ToastContainer></ToastContainer>
      <SideBar
        clients={sidebarData}
        PageDown={() => setClientsPage(clientsPage - 1)}
        PageUp={() => setClientsPage(clientsPage + 1)}
        page={clientsPage}
        fetchNextLevelForData={(id, level) => fetchNextLevelForData(id, level)}
      ></SideBar>
      <TimeEntry
        timeEntries={timeEntryData}
        PageDown={() => setTimeEntryPage(timeEntryPage - 1)}
        PageUp={() => setTimeEntryPage(timeEntryPage + 1)}
        page={timeEntryPage}
        editTimeEntry={(te: TimeEntryRequest, id?: number) =>
          editTimeEntry(te, id)
        }
      ></TimeEntry>
    </div>
  );
}
