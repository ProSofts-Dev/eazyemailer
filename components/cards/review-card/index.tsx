import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReviewForm } from "./review-form";
import { ReviewStats } from "./review-stats";

export function ReviewCard() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Reviews & Feedback</CardTitle>
        <CardDescription>
          Share your experience or view what others are saying
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="write">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="write">Write a Review</TabsTrigger>
            <TabsTrigger value="stats">Review Stats</TabsTrigger>
          </TabsList>
          <TabsContent value="write" className="mt-4">
            <ReviewForm />
          </TabsContent>
          <TabsContent value="stats" className="mt-4">
            <ReviewStats />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}