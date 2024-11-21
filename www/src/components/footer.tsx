import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#f5f5f7] py-8">
      <div className="container mx-auto px-4 text-center text-sm text-gray-600">
        <p>&copy; 2023 CodeHaven IDE. All rights reserved.</p>
        <p className="mt-2">
          <Link href="#" className="hover:underline">
            Privacy Policy
          </Link>{" "}
          |
          <Link href="#" className="hover:underline ml-2">
            Terms of Service
          </Link>
        </p>
      </div>
    </footer>
  );
}
