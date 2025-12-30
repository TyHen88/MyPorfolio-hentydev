"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import { GoogleSheetMedelRecord } from "@/lib/model/GoogleSheet";
import AdminContentsForm from "./AdminContentsForm";
import { Button } from "@/components/ui/button";

export const AdminContainerList = () => {
    const [contents, setContents] = useState<GoogleSheetMedelRecord[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<GoogleSheetMedelRecord | undefined>(undefined);
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

    const fetchContents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/sheet?status=true", { cache: "no-store" });
            if (!res.ok) throw new Error(`Failed to fetch contents (${res.status})`);
            const data: GoogleSheetMedelRecord[] = await res.json();
            setContents(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch contents");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchContents();
    }, [fetchContents]);

    const handleSubmit = async (formData: GoogleSheetMedelRecord) => {
        setError(null);
        const isUpdate = Boolean(selected?.id);
        try {
            const payload = { ...formData };
            // For creation, let the backend assign the row id
            if (!isUpdate) {
                delete (payload as any).id;
            }

            const res = await fetch("/api/sheet", {
                method: isUpdate ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody.error || `Failed to ${isUpdate ? "update" : "create"} content`);
            }

            await fetchContents();
            setSelected(undefined);
            setIsFormVisible(false);
        } catch (err: any) {
            setError(err.message || "Failed to submit");
        }
    };

    const handleDelete = async (id: string) => {
        setError(null);
        try {
            const res = await fetch(`/api/sheet?id=${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                throw new Error(errBody.error || "Failed to delete content");
            }
            if (selected?.id === id) {
                setSelected(undefined);
            }
            await fetchContents();
        } catch (err: any) {
            setError(err.message || "Failed to delete");
        }
    };

    const handleCancel = () => {
        setSelected(undefined);
        setIsFormVisible(false);
    };

    const handleCreateClick = () => {
        setSelected(undefined);
        setIsFormVisible(true);
    };

    const sortedContents = useMemo(
        () => [...contents].sort((a, b) => b.updateAt.localeCompare(a.updateAt || a.createAt)),
        [contents]
    );

    return (
        <div className="grid gap-8 lg:grid-cols-[420px,1fr]">
            {isFormVisible && (
                <div className="rounded-lg border bg-card p-4 shadow-sm">
                    <h2 className="text-lg font-semibold mb-2">{selected ? "Edit Content" : "Create Content"}</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        {selected ? "Update the selected content entry." : "Create a new content entry."}
                    </p>
                    <AdminContentsForm content={selected} onSubmit={handleSubmit} onCancel={handleCancel} />
                </div>
            )}

            <div className="rounded-lg border bg-card p-4 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold">Contents</h2>
                        <p className="text-sm text-muted-foreground">
                            {loading ? "Loading..." : `${contents.length} item${contents.length === 1 ? "" : "s"}`}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button size="sm" onClick={handleCreateClick}>
                            New Content
                        </Button>
                        <Button variant="outline" size="sm" onClick={fetchContents} disabled={loading}>
                            Refresh
                        </Button>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive">
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {sortedContents.map((item) => (
                        <div
                            key={item.id}
                            className="rounded-md border p-4 flex flex-col gap-2 hover:border-primary/60 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm text-muted-foreground">#{item.id}</p>
                                    <h3 className="text-base font-semibold">{item.contentName || "(No name)"}</h3>
                                    {item.contentTitle && (
                                        <p className="text-sm text-muted-foreground">{item.contentTitle}</p>
                                    )}
                                    {item.contentSubtitle && (
                                        <p className="text-sm text-muted-foreground italic">{item.contentSubtitle}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            setSelected(item);
                                            setIsFormVisible(true);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                            <div className="text-xs text-muted-foreground flex gap-2 flex-wrap">
                                <span className="rounded bg-muted px-2 py-1">Type: {item.contentType}</span>
                                {item.contentDateStart && (
                                    <span className="rounded bg-muted px-2 py-1">Start: {item.contentDateStart}</span>
                                )}
                                {item.contentDateEnd && (
                                    <span className="rounded bg-muted px-2 py-1">End: {item.contentDateEnd}</span>
                                )}
                                {item.contentTags?.length > 0 && (
                                    <span className="rounded bg-muted px-2 py-1">
                                        Tags: {item.contentTags.join(", ")}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}

                    {!loading && sortedContents.length === 0 && (
                        <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                            No contents found. Create the first entry using the form.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
