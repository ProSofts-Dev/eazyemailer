import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ReferralStats } from "./referral-stats";
import { ReferralLink } from "./referral-link";

export function ReferralCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Referral Program</CardTitle>
        <CardDescription>
          Share your referral link and track your progress
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ReferralStats />
        <ReferralLink />
      </CardContent>
    </Card>
  );
}