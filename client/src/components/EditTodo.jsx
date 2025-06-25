import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EditIcon } from "lucide-react";
import { useState } from "react";

function EditTodo({ title, id, handleUpdate }) {
  const [updatedTitle, setUpdatedTitle] = useState(title);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <EditIcon size={20} className="" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Todo</DialogTitle>
          <DialogDescription>
            Make changes to your todo here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DialogTrigger asChild>
          <form className="flex flex-col gap-2" onSubmit={(e) => { e.preventDefault(); handleUpdate({ id, title: updatedTitle }); }}>
            <input type="hidden" name="id" value={id} />
            <Label htmlFor="title">Previous Todo</Label>
            <Input
              id="title"
              name="title"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
              className="col-span-3"
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogTrigger>
      </DialogContent>
    </Dialog>
  );
}

export default EditTodo;
