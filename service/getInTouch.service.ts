function sendGmail(to: string, subject: string, body: string): void {
    if (typeof window !== 'undefined') {
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    }
}
export default sendGmail;