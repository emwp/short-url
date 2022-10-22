import type { NextPage } from "next";
import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";
import { Toaster, toast } from "react-hot-toast";

const Home: NextPage = () => {
  const { data: list, refetch } = trpc.useQuery(["findAll"], {
    refetchOnWindowFocus: false,
  });

  const addNewUrl = trpc.useMutation(["addOne"]);
  const deleteUrl = trpc.useMutation(["removeOne"]);

  const [slug, setSlug] = useState<string>("");
  const [url, setUrl] = useState<string>("");

  const createShortUrl = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await addNewUrl.mutateAsync({ url, slug });
    setSlug("");
    setUrl("");
    toast.success("Short URL Created");
    refetch();
  };

  const deleteShortUrl = async (id: number) => {
    await deleteUrl.mutateAsync({ id });
    toast.success("Short URL Deleted");
    refetch();
  };

  return (
    <div className="min-h-screen grid place-items-center max-h-screen">
      <Toaster />
      <div className="h-min grid gap-12">
        <div className="grid justify-items-center gap-2">
          <h1 className="text-2xl font-bold">Add new URL</h1>
          <form className="grid gap-2" onSubmit={(e) => createShortUrl(e)}>
            <div className="grid gap-2 grid-flow-row">
              <label htmlFor="url">URL</label>
              <input
                className="rounded p-1"
                type="text"
                id="url"
                name="url"
                value={url}
                onChange={(ev) => setUrl(ev.target.value)}
              />
            </div>
            <div className="grid gap-2 grid-flow-row">
              <label htmlFor="slug">Slug</label>
              <input
                className="rounded p-1"
                type="text"
                id="slug"
                name="slug"
                value={slug}
                onChange={(ev) => setSlug(ev.target.value)}
              />
            </div>
            <button
              className="btn btn-outline btn-sm"
              disabled={!url.length || addNewUrl.isLoading}
              type="submit"
            >
              ADD
            </button>
          </form>
        </div>
        <div className="grid justify-items-center">
          <h1 className="text-2xl font-bold">Shorturls created</h1>
          <ul className="grid justify-items-center">
            {list?.length ? (
              list?.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-3 place-items-center"
                >
                  <a href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.slug}
                  </a>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${global.location.origin}/${item.slug}`
                      );
                      toast.success("Copied to clipboard!");
                    }}
                  >
                    Copy
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => deleteShortUrl(item.id)}
                  >
                    Delete
                  </button>
                </li>
              ))
            ) : (
              <div>
                <p className="text-lg font-normal">Nothing here yet!</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
