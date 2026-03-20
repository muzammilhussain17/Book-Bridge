import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { userApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const RatingsPage = () => {
    const { user } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [avgScore, setAvgScore] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRatingsData = async () => {
            if (!user?.id) return;
            try {
                setIsLoading(true);
                const [ratingsRes, avgRes] = await Promise.all([
                    userApi.getRatings(user.id),
                    userApi.getAvgRating(user.id)
                ]);
                setRatings(ratingsRes.data);
                // The average score endpoint returns { userId: X, averageScore: Y }
                setAvgScore(avgRes.data.averageScore || 0);
            } catch (err) {
                console.error("Failed to fetch ratings", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRatingsData();
    }, [user]);

    // Calculate distribution for progress bars
    const calculateDistribution = () => {
        const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        ratings.forEach(r => {
            if (r.score >= 1 && r.score <= 5) {
                dist[r.score]++;
            }
        });
        return dist;
    };

    const distribution = calculateDistribution();
    const totalRatings = ratings.length;

    return (
        <div className="flex flex-col gap-6 w-full h-full pb-10 max-w-4xl mx-auto">
            <div className="border-b border-slate-200 pb-5">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">Ratings & Reviews</h2>
                <p className="text-sm text-slate-500 mt-1">Your reputation on the campus exchange network.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center p-12 text-slate-500">Loading ratings data...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
                        <Card className="shadow-sm">
                            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                                <h3 className="text-5xl font-black text-slate-900 mb-2">
                                    {avgScore > 0 ? avgScore.toFixed(1) : 'No'}
                                </h3>
                                <div className="flex items-center gap-1 mb-2 text-amber-500">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.round(avgScore) ? 'fill-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Average Rating</p>
                                <p className="text-[10px] text-slate-400 mt-1">Based on {totalRatings} reviews</p>
                            </CardContent>
                        </Card>
                        <Card className="shadow-sm md:col-span-2">
                            <CardContent className="p-6 flex flex-col justify-center h-full">
                                <div className="space-y-3">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = distribution[star];
                                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-3">
                                                <span className="w-3 text-xs font-medium text-slate-500">{star}</span>
                                                <Star className="w-3 h-3 text-slate-400" />
                                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                                <span className="w-6 text-right text-xs text-slate-400">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mt-4">Recent Reviews</h3>

                    {ratings.length === 0 ? (
                        <div className="py-12 text-center text-slate-500 bg-slate-50 border border-slate-200 border-dashed rounded-[4px]">
                            <Star className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p>You haven't received any reviews yet.</p>
                            <p className="text-sm mt-1">Complete transactions or exchanges to build your reputation.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {ratings.map(review => (
                                <Card key={review.id} className="shadow-sm border-slate-200">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                                                    {review.reviewerName ? review.reviewerName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{review.reviewerName}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5 text-amber-500">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.score ? 'fill-amber-500' : 'fill-slate-200 text-slate-200'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {review.reviewText && (
                                            <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{review.reviewText}</p>
                                        )}
                                        <p className="text-xs text-slate-500 border-t border-slate-100 pt-3 flex items-center gap-2">
                                            <MessageSquare className="w-3 h-3" />
                                            {review.referenceType === 'TRANSACTION' ? 'Purchase/Sale' : review.referenceType === 'EXCHANGE' ? 'Book Exchange' : 'Platform Interaction'}
                                            {' '} (Ref: {review.referenceId})
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
