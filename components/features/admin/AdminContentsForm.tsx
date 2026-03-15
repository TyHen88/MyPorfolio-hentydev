"use client"

import { GoogleSheetMedelRecord } from "@/lib/model/GoogleSheet";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface AdminContentsFormProps {
    content?: GoogleSheetMedelRecord;
    onSubmit: (formData: GoogleSheetMedelRecord) => Promise<void>;
    onCancel: () => void;
}

const createEmptyFormData = (): GoogleSheetMedelRecord => ({
        id: uuidv4(),
        contentName: "",
        contentTitle: "",
        contentDescription: "",
        contentImage: "",
        contentLink: "",
        contentTags: [],
        contentDateStart: "",
        contentDateEnd: "",
        contentType: "other",
        createAt: "",
        updateAt: "",
        status: true,
        contentSubtitle: "",
    });

const AdminContentsForm = ({ content, onSubmit, onCancel }: AdminContentsFormProps) => {
    const [formData, setFormData] = useState<GoogleSheetMedelRecord>(() => content ? content : createEmptyFormData());

    useEffect(() => {
        if (content) {
            setFormData(content);
        } else {
            setFormData(createEmptyFormData());
        }
    }, [content]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, type } = e.target;

        // Special handling for contentTags (comma-separated)
        if (name === "contentTags") {
            setFormData({
                ...formData,
                contentTags: value.split(",").map((tag) => tag.trim()).filter(tag => tag.length > 0),
            });
        } else if (name === "status") {
            setFormData({
                ...formData,
                status: type === "checkbox" ? (e.target as HTMLInputElement).checked : value === "true",
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    // Separate onChange handler for select (contentType)
    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleCancelClick = () => {
        setFormData(createEmptyFormData());
        onCancel();
    };

    const inputClassName = "w-full px-4 py-2 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";
    const labelClassName = "block text-sm font-medium mb-2 text-foreground";
    const fieldClassName = "mb-4";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Accordion type="multiple" defaultValue={["basic", "content"]} className="w-full">
                {/* Basic Information */}
                <AccordionItem value="basic">
                    <AccordionTrigger>Basic Information</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className={fieldClassName}>
                                <label htmlFor="contentName" className={labelClassName}>
                                    Content Name <span className="text-destructive">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="contentName"
                                    name="contentName"
                                    value={formData.contentName}
                                    onChange={handleInputChange}
                                    required
                                    className={inputClassName}
                                    placeholder="Enter content name"
                                />
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentTitle" className={labelClassName}>
                                    Content Title
                                </label>
                                <input
                                    type="text"
                                    id="contentTitle"
                                    name="contentTitle"
                                    value={formData.contentTitle}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                    placeholder="Enter content title"
                                />
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentSubtitle" className={labelClassName}>
                                    Content Subtitle
                                </label>
                                <textarea
                                    id="contentSubtitle"
                                    name="contentSubtitle"
                                    value={formData.contentSubtitle}
                                    onChange={handleInputChange}
                                    placeholder="Enter content subtitle"
                                    rows={3}
                                    className={`${inputClassName} resize-none`}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Content Details */}
                <AccordionItem value="content">
                    <AccordionTrigger>Content Details</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className={fieldClassName}>
                                <label htmlFor="contentDescription" className={labelClassName}>
                                    Content Description
                                </label>
                                <textarea
                                    id="contentDescription"
                                    name="contentDescription"
                                    value={formData.contentDescription}
                                    onChange={handleInputChange}
                                    rows={5}
                                    className={`${inputClassName} resize-none`}
                                    placeholder="Enter content description"
                                />
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentImage" className={labelClassName}>
                                    Content Image URL
                                </label>
                                <input
                                    type="text"
                                    id="contentImage"
                                    name="contentImage"
                                    value={formData.contentImage}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentLink" className={labelClassName}>
                                    Content Link
                                </label>
                                <input
                                    type="text"
                                    id="contentLink"
                                    name="contentLink"
                                    value={formData.contentLink}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Metadata */}
                <AccordionItem value="metadata">
                    <AccordionTrigger>Metadata</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className={fieldClassName}>
                                <label htmlFor="contentType" className={labelClassName}>
                                    Content Type
                                </label>
                                <select
                                    id="contentType"
                                    name="contentType"
                                    value={formData.contentType}
                                    onChange={handleSelectChange}
                                    className={inputClassName}
                                >
                                    <option value="skill">Skill</option>
                                    <option value="aboutMe">About Me</option>
                                    <option value="project">Project</option>
                                    <option value="experience">Experience</option>
                                    <option value="research">Research</option>
                                    <option value="learning">Learning</option>
                                    <option value="blog">Blog</option>
                                    <option value="education">Education</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentTags" className={labelClassName}>
                                    Content Tags
                                </label>
                                <input
                                    type="text"
                                    id="contentTags"
                                    name="contentTags"
                                    value={formData.contentTags.join(", ")}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                    placeholder="tag1, tag2, tag3"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    Separate multiple tags with commas
                                </p>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                {/* Dates */}
                <AccordionItem value="dates">
                    <AccordionTrigger>Dates</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <div className={fieldClassName}>
                                <label htmlFor="contentDateStart" className={labelClassName}>
                                    Content Date Start
                                </label>
                                <input
                                    type="date"
                                    id="contentDateStart"
                                    name="contentDateStart"
                                    value={formData.contentDateStart}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                            </div>
                            <div className={fieldClassName}>
                                <label htmlFor="contentDateEnd" className={labelClassName}>
                                    Content Date End
                                </label>
                                <input
                                    type="date"
                                    id="contentDateEnd"
                                    name="contentDateEnd"
                                    value={formData.contentDateEnd}
                                    onChange={handleInputChange}
                                    className={inputClassName}
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t">
                <Button type="submit" className="flex-1 sm:flex-none">
                    {content ? "Update" : "Create"} Content
                </Button>
                <Button type="button" onClick={handleCancelClick} variant="outline" className="flex-1 sm:flex-none">
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AdminContentsForm;
