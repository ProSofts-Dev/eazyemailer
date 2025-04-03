"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Mail,
  BarChart,
  Filter,
} from "lucide-react";
import { useEffect } from "react";
import { useState } from "react";

export default function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [data, setData] = useState<any>();
  const [dataLoadin, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setDataLoading(true);
    const res = await fetch('/api/dash/recent');
    const data = await res.json();
    setData(data);
    setDataLoading(false);
  }

  const fetchStats = async () => {
    setLoading(true);
    const res = await fetch('/api/dash/stats');
    const data = await res.json();
    setStats(data.stats);
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {loading ? [...Array(3 )].map((_, index) => 
        <Card key={index} className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="text-sm text-muted-foreground" style={{ width: 100, height: 10 }} />
            <Skeleton className="text-2xl font-bold mt-1" style={{ width: 50, height: 10 }}/>
          </div>
          <div className="rounded-full p-3 bg-secondary">
            <Skeleton className="h-6 w-6" />
          </div>
        </div>
      </Card>) : 
         stats?.map((stat) => (
          <Card key={stat.name} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="rounded-full p-3 bg-secondary">
                {stat.icon === 'Users' ? <Users className="h-6 w-6" /> :stat.icon === 'Mail' ? <Mail className="h-6 w-6" /> : <BarChart className="h-6 w-6" />}
              </div>
            </div>
            <div className="flex items-center mt-4">
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={stat.trend === "up" ? "text-green-500" : "text-red-500"}
              >
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Campaigns</h2>
          <div className="space-y-4">
            {dataLoadin ? [...Array(3 )].map((_, index) =>  
            <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <Skeleton style={{ height: 10, width: 100 }} />
                <Skeleton className="text-muted-foreground" style={{ height: 10, width: 50 }} />
              </div>) : 
              data?.campaigns?.map((campaign: any) => (
              <div
                key={campaign}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span>{campaign.name}</span>
                <span className="text-muted-foreground">{new Date(campaign.sentAt).toISOString().split('T')[0]}</span>
              </div>
            ))}
          </div>
          {!dataLoadin && !data?.campaigns?.length ? <div>
            <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <div className="text-center">
                <Filter className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium">No active campaigns</h3>
                <p className="text-sm text-muted-foreground">
                  Send a campaign to start seeing here
                </p>
              </div>
            </div>
          </div> : <></>}
        </Card>
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Performing Emails</h2>
          <div className="space-y-4">
            {dataLoadin ? [...Array(3 )].map((_, index) =>  
              <div
                key={index}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <Skeleton style={{ height: 10, width: 100 }} />
                <Skeleton className="text-muted-foreground" style={{ height: 10, width: 50 }} />
              </div>) : 
              data?.topEmails?.map((email: any) => (
              <div
                key={email.templateName}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <span>{email.templateName}</span>
                <span className="text-muted-foreground">
                  Open Rate: {`${email.averageOpenRate} %`}
                </span>
              </div>
            ))}
          </div>
          {!dataLoadin && !data?.topEmails?.length ? 
            <div>
              <div className="h-[200px] flex items-center justify-center border-2 border-dashed rounded-lg">
                <div className="text-center">
                  <Mail className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium">No emails sent</h3>
                  <p className="text-sm text-muted-foreground">
                    Start sending emails to see data here
                  </p>
                </div>
              </div>
            </div> : <></>}
        </Card>
      </div>
    </div>
  );
}