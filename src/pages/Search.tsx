import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Search as SearchIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Search = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchParams.get("q") || "";

  useEffect(() => {
    setSearchQuery(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to programs page with search
      window.location.href = `/programs?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>جستجو در لیفت لجندز | برنامه‌های تمرینی و تغذیه</title>
        <meta name="description" content="جستجو در برنامه‌های تمرینی، رژیم‌های غذایی و مقالات بدنسازی لیفت لجندز" />
        <meta name="robots" content="noindex, follow" />
        {query && <meta name="robots" content="noindex, nofollow" />}
        <link rel="canonical" href="https://liftlegends.ir/search" />
      </Helmet>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            جستجو در لیفت لجندز
          </h1>
          
          {query && (
            <p className="text-gray-400 mb-8">
              نتایج جستجو برای: <span className="text-gold-400">"{query}"</span>
            </p>
          )}

          <form onSubmit={handleSearch} className="mb-12">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="جستجوی برنامه‌ها، مقالات و محتوا..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-gray-900 border-gray-700 text-white"
              />
              <Button type="submit" className="bg-gold-500 hover:bg-gold-600">
                <SearchIcon size={20} />
              </Button>
            </div>
          </form>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gold-400">برنامه‌های تمرینی</CardTitle>
                <CardDescription>
                  برنامه‌های تخصصی بدنسازی و تناسب اندام
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/programs">
                  <Button variant="outline" className="w-full">
                    مشاهده برنامه‌ها
                    <ArrowRight className="mr-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-gold-400">مقالات بلاگ</CardTitle>
                <CardDescription>
                  مقالات تخصصی تمرین، تغذیه و مکمل‌ها
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/blog">
                  <Button variant="outline" className="w-full">
                    مشاهده مقالات
                    <ArrowRight className="mr-2" size={16} />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;