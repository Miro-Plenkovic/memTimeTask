import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { type TimeEntryResponse, type TimeEntryRequest } from "./api";

export type TimeEntryProps = {
  timeEntries: TimeEntryResponse[] | null;
  PageDown: () => void;
  PageUp: () => void;
  page: number;
  editTimeEntry: (te: TimeEntryRequest, id?: number) => void;
};

export default function TimeEntry(props: TimeEntryProps) {
  const { register, setValue, reset } = useForm({
    defaultValues: {
      id: 0,
      taskId: 0,
      comment: "",
      start: "",
      end: "",
    },
  });

  const dateForDateTimeInputValue = (date: Date) => {
    return new Date(
      date.getTime() + new Date().getTimezoneOffset() * -60 * 1000
    )
      .toISOString()
      .slice(0, 19);
  };

  const [formVisible, setFormVisible] = useState<boolean>(false);
  //if it is present, then it's an update, otherwise, create new
  const [activeTImeEntryId, setActiveTimeEntryId] = useState<
    number | undefined
  >(undefined);
  return (
    <div>
      {props.page > 0 ? <div onClick={props.PageDown}>^</div> : ""}
      <div className="TimeEntry">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>TaskId</th>
              <th>Comment</th>
              <th>Start</th>
              <th>End</th>
              <th>CreatedAt</th>
              <th></th>
            </tr>
          </thead>
          {props.timeEntries?.map((te) => {
            return (
              <tr>
                <td>{te.id}</td>
                <td>{te.taskId}</td>
                <td>{te.comment}</td>
                <td>{`${new Date(te.start).toLocaleDateString()} ${new Date(
                  te.start
                ).toLocaleTimeString()}`}</td>
                <td>{`${new Date(te.end).toLocaleDateString()} ${new Date(
                  te.end
                ).toLocaleTimeString()}`}</td>
                <td>{`${new Date(te.createdAt).toLocaleDateString()} ${new Date(
                  te.createdAt
                ).toLocaleTimeString()}`}</td>
                <td>
                  <button
                    onClick={() => {
                      setValue("taskId", te.taskId);
                      setValue("comment", te.comment as string);
                      setValue(
                        "start",
                        dateForDateTimeInputValue(new Date(te.start))
                      );
                      setValue(
                        "end",
                        dateForDateTimeInputValue(new Date(te.end))
                      );
                      setFormVisible(true);
                      setActiveTimeEntryId(te.id);
                    }}
                  >
                    edit
                  </button>
                </td>
              </tr>
            );
          })}

          <tr>
            <td>
              <button
                onClick={() => {
                  setFormVisible(true);
                }}
              >
                add new time entry
              </button>
            </td>
          </tr>
        </table>
      </div>
      <div onClick={props.PageUp}>v</div>
      <form
        style={{ display: formVisible ? "block" : "none" }}
        //ref={formRef}
        onSubmit={(e: React.SyntheticEvent) => {
          e.preventDefault();
          const target = e.target as typeof e.target & {
            taskId: { value: number };
            comment: { value: string };
            start: { value: Date };
            end: { value: Date };
          };
          const taskId = target.taskId.value;
          const comment = target.comment.value;
          const start = target.start.value;
          const end = target.end.value;

          props.editTimeEntry(
            {
              taskId,
              comment,
              start,
              end,
            },
            activeTImeEntryId
          );
          reset();
          setFormVisible(false);
          setActiveTimeEntryId(undefined);
        }}
      >
        <div>
          <label>
            TaskId:
            <input {...register("taskId")} type="number" name="taskId" />
          </label>
        </div>
        <div>
          <label>
            Comment:
            <input {...register("comment")} type="text" name="comment" />
          </label>
        </div>
        <div>
          <label>
            Start:
            <input {...register("start")} type="datetime-local" name="start" />
          </label>
        </div>
        <div>
          <label>
            End:
            <input {...register("end")} type="datetime-local" name="end" />
          </label>
        </div>
        <div>
          <input type="submit" value="Submit" />
        </div>
        <div>
          <button
            onClick={() => {
              reset();
              setFormVisible(false);
              setActiveTimeEntryId(undefined);
            }}
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
}
