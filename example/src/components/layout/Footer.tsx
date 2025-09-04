export function Footer() {
  return (
    <footer className="border-t py-6 md:px-8 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} seunjin. All rights reserved.
        </p>
        <a
          href="https://github.com/seunjin/react-layered-dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium underline underline-offset-4"
        >
          View on GitHub
        </a>
      </div>
    </footer>
  );
}
