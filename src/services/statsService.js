import { getDatabase } from './database';
import {
    format, subDays, subWeeks, subMonths, subYears,
    startOfWeek, endOfWeek, startOfMonth, endOfMonth,
    startOfYear, endOfYear, isValid, parseISO
} from 'date-fns';

// --- Helpers ---
function normalizeDate(input) {
    if (!input) return null;

    if (input instanceof Date) {
        return isValid(input) ? input : null;
    }

    if (typeof input === "string") {
        const parsed = parseISO(input); // works with YYYY-MM-DD
        return isValid(parsed) ? parsed : null;
    }

    return null;
}

function safeFormat(input, pattern) {
    const d = normalizeDate(input);
    return d ? format(d, pattern) : null;
}

export class StatsService {
    static async getWeeklyStats(date = new Date()) {
        try {
            const startDate = startOfWeek(normalizeDate(date), { weekStartsOn: 1 });
            const endDate = endOfWeek(normalizeDate(date), { weekStartsOn: 1 });

            const entries = await this.getEntriesInRange(startDate, endDate);

            return {
                totalEntries: entries.length,
                totalGoalsCompleted: this.sumGoalsCompleted(entries),
                totalGoalsSet: this.sumGoalsSet(entries),
                completionRate: this.calculateCompletionRate(entries),
                daysWithEntries: entries.length,
                streak: await this.calculateStreak(date),
            };
        } catch (error) {
            console.error('Error getting weekly stats:', error);
            throw error;
        }
    }

    static async getMonthlyStats(date = new Date()) {
        try {
            const startDate = startOfMonth(normalizeDate(date));
            const endDate = endOfMonth(normalizeDate(date));

            const entries = await this.getEntriesInRange(startDate, endDate);

            return {
                totalEntries: entries.length,
                totalGoalsCompleted: this.sumGoalsCompleted(entries),
                totalGoalsSet: this.sumGoalsSet(entries),
                completionRate: this.calculateCompletionRate(entries),
                daysWithEntries: entries.length,
                averageGoalsPerDay: this.calculateAverageGoalsPerDay(entries),
            };
        } catch (error) {
            console.error('Error getting monthly stats:', error);
            throw error;
        }
    }

    static async getYearlyStats(date = new Date()) {
        try {
            const startDate = startOfYear(normalizeDate(date));
            const endDate = endOfYear(normalizeDate(date));

            const entries = await this.getEntriesInRange(startDate, endDate);

            return {
                totalEntries: entries.length,
                totalGoalsCompleted: this.sumGoalsCompleted(entries),
                totalGoalsSet: this.sumGoalsSet(entries),
                completionRate: this.calculateCompletionRate(entries),
                daysWithEntries: entries.length,
                averageGoalsPerDay: this.calculateAverageGoalsPerDay(entries),
                monthlyBreakdown: await this.getMonthlyBreakdown(date),
            };
        } catch (error) {
            console.error('Error getting yearly stats:', error);
            throw error;
        }
    }

    static async calculateStreak(endDate = new Date()) {
        try {
            const db = await getDatabase();
            let currentDate = normalizeDate(endDate);
            let streak = 0;

            while (currentDate) {
                const dateString = safeFormat(currentDate, 'yyyy-MM-dd');
                if (!dateString) break;

                const result = await db.getFirstAsync(
                    'SELECT id FROM journal_entries WHERE date = ?',
                    [dateString]
                );

                if (result) {
                    streak++;
                    currentDate = subDays(currentDate, 1);
                } else {
                    break;
                }

                if (streak >= 365) break;
            }

            return streak;
        } catch (error) {
            console.error('Error calculating streak:', error);
            return 0;
        }
    }

    static async getEntriesInRange(startDate, endDate) {
        try {
            const db = await getDatabase();
            const safeStart = normalizeDate(startDate);
            const safeEnd = normalizeDate(endDate);

            if (!safeStart || !safeEnd) {
                console.warn("Invalid date range:", startDate, endDate);
                return [];
            }

            const startDateString = format(safeStart, 'yyyy-MM-dd');
            const endDateString = format(safeEnd, 'yyyy-MM-dd');

            const results = await db.getAllAsync(
                `SELECT goals, goals_completed FROM journal_entries
                 WHERE date >= ? AND date <= ?
                 ORDER BY date DESC`,
                [startDateString, endDateString]
            );

            return results.map(entry => ({
                ...entry,
                goals: JSON.parse(entry.goals),
            }));
        } catch (error) {
            console.error('Error getting entries in range:', error);
            return [];
        }
    }

    static sumGoalsCompleted(entries) {
        return entries.reduce((sum, entry) => sum + entry.goals_completed, 0);
    }

    static sumGoalsSet(entries) {
        return entries.reduce((sum, entry) => {
            const goals = Array.isArray(entry.goals) ? entry.goals : [];
            return sum + goals.length;
        }, 0);
    }

    static calculateCompletionRate(entries) {
        const totalGoalsSet = this.sumGoalsSet(entries);
        const totalGoalsCompleted = this.sumGoalsCompleted(entries);

        if (totalGoalsSet === 0) return 0;
        return Math.round((totalGoalsCompleted / totalGoalsSet) * 100);
    }

    static calculateAverageGoalsPerDay(entries) {
        if (entries.length === 0) return 0;
        const totalGoals = this.sumGoalsSet(entries);
        return Math.round((totalGoals / entries.length) * 10) / 10;
    }

    static async getMonthlyBreakdown(year = new Date().getFullYear()) {
        try {
            const breakdown = [];

            for (let month = 0; month < 12; month++) {
                const baseDate = normalizeDate(new Date(year, month, 1));
                if (!baseDate) continue;

                const startDate = startOfMonth(baseDate);
                const endDate = endOfMonth(baseDate);

                const entries = await this.getEntriesInRange(startDate, endDate);

                breakdown.push({
                    month: month + 1,
                    monthName: safeFormat(baseDate, 'MMMM'),
                    totalEntries: entries.length,
                    totalGoalsCompleted: this.sumGoalsCompleted(entries),
                    completionRate: this.calculateCompletionRate(entries),
                });
            }

            return breakdown;
        } catch (error) {
            console.error('Error getting monthly breakdown:', error);
            return [];
        }
    }

    // --- other methods (unchanged) ---
    static async getDashboardStats() {
        try {
            const now = new Date();
            const [weeklyStats, monthlyStats, yearlyStats, overallStats] = await Promise.all([
                this.getWeeklyStats(now),
                this.getMonthlyStats(now),
                this.getYearlyStats(now),
                this.getOverallStats()
            ]);

            return {
                current: {
                    streak: weeklyStats.streak,
                    weeklyCompletionRate: weeklyStats.completionRate,
                    monthlyCompletionRate: monthlyStats.completionRate,
                    yearlyCompletionRate: yearlyStats.completionRate,
                },
                overview: {
                    totalEntries: overallStats.totalEntries,
                    totalGoalsCompleted: overallStats.totalGoalsCompleted,
                    averageCompletionRate: overallStats.averageCompletionRate,
                    longestStreak: overallStats.longestStreak,
                },
                recent: {
                    thisWeek: {
                        entries: weeklyStats.totalEntries,
                        goalsCompleted: weeklyStats.totalGoalsCompleted,
                        completionRate: weeklyStats.completionRate,
                    },
                    thisMonth: {
                        entries: monthlyStats.totalEntries,
                        goalsCompleted: monthlyStats.totalGoalsCompleted,
                        completionRate: monthlyStats.completionRate,
                    },
                },
                trends: await this.getTrendData(),
            };
        } catch (error) {
            console.error('Error getting dashboard stats:', error);
            throw error;
        }
    }

    static async getOverallStats() {
        try {
            const db = await getDatabase();

            const result = await db.getFirstAsync(
                `SELECT
                     COUNT(*) as totalEntries,
                     SUM(goals_completed) as totalGoalsCompleted,
                     AVG(CASE WHEN goals_completed > 0 THEN goals_completed * 100.0 / (
                         json_array_length(goals)
                         ) ELSE 0 END) as averageCompletionRate
                 FROM journal_entries`
            );

            const longestStreak = await this.getLongestStreak();

            return {
                totalEntries: result.totalEntries || 0,
                totalGoalsCompleted: result.totalGoalsCompleted || 0,
                averageCompletionRate: Math.round(result.averageCompletionRate || 0),
                longestStreak,
            };
        } catch (error) {
            console.error('Error getting overall stats:', error);
            return {
                totalEntries: 0,
                totalGoalsCompleted: 0,
                averageCompletionRate: 0,
                longestStreak: 0,
            };
        }
    }

    static async getLongestStreak() {
        try {
            const db = await getDatabase();

            const results = await db.getAllAsync(
                'SELECT date FROM journal_entries ORDER BY date ASC'
            );

            if (results.length === 0) return 0;

            let longestStreak = 1;
            let currentStreak = 1;
            let previousDate = normalizeDate(results[0].date);

            for (let i = 1; i < results.length; i++) {
                const currentDate = normalizeDate(results[i].date);
                if (!currentDate || !previousDate) continue;

                const daysDiff = Math.floor((currentDate - previousDate) / (1000 * 60 * 60 * 24));

                if (daysDiff === 1) {
                    currentStreak++;
                    longestStreak = Math.max(longestStreak, currentStreak);
                } else {
                    currentStreak = 1;
                }

                previousDate = currentDate;
            }

            return longestStreak;
        } catch (error) {
            console.error('Error calculating longest streak:', error);
            return 0;
        }
    }

    static async getTrendData() {
        try {
            const trends = [];
            const today = new Date();

            for (let i = 6; i >= 0; i--) {
                const date = subDays(today, i);
                const dateString = safeFormat(date, 'yyyy-MM-dd');

                const db = await getDatabase();
                const result = await db.getFirstAsync(
                    'SELECT goals_completed, goals FROM journal_entries WHERE date = ?',
                    [dateString]
                );

                if (result) {
                    const goals = JSON.parse(result.goals);
                    const completionRate = goals.length > 0 ? Math.round((result.goals_completed / goals.length) * 100) : 0;

                    trends.push({
                        date: dateString,
                        dayName: safeFormat(date, 'EEE'),
                        hasEntry: true,
                        goalsCompleted: result.goals_completed,
                        completionRate,
                    });
                } else {
                    trends.push({
                        date: dateString,
                        dayName: safeFormat(date, 'EEE'),
                        hasEntry: false,
                        goalsCompleted: 0,
                        completionRate: 0,
                    });
                }
            }

            return trends;
        } catch (error) {
            console.error('Error getting trend data:', error);
            return [];
        }
    }

    static async getSectionCompletionStats() {
        try {
            const db = await getDatabase();

            const results = await db.getAllAsync(
                'SELECT affirmations, gratitude, goals FROM journal_entries'
            );

            let affirmationsCount = 0;
            let gratitudeCount = 0;
            let goalsCount = 0;
            let totalEntries = results.length;

            results.forEach(entry => {
                const affirmations = JSON.parse(entry.affirmations || '[]');
                const gratitude = JSON.parse(entry.gratitude || '[]');
                const goals = JSON.parse(entry.goals || '[]');

                if (affirmations.some(item => item.trim() !== '')) affirmationsCount++;
                if (gratitude.some(item => item.trim() !== '')) gratitudeCount++;
                if (goals.some(goal => goal.text && goal.text.trim() !== '')) goalsCount++;
            });

            return {
                affirmations: {
                    completedEntries: affirmationsCount,
                    completionRate: totalEntries > 0 ? Math.round((affirmationsCount / totalEntries) * 100) : 0,
                },
                gratitude: {
                    completedEntries: gratitudeCount,
                    completionRate: totalEntries > 0 ? Math.round((gratitudeCount / totalEntries) * 100) : 0,
                },
                goals: {
                    completedEntries: goalsCount,
                    completionRate: totalEntries > 0 ? Math.round((goalsCount / totalEntries) * 100) : 0,
                },
                totalEntries,
            };
        } catch (error) {
            console.error('Error getting section completion stats:', error);
            return {
                affirmations: { completedEntries: 0, completionRate: 0 },
                gratitude: { completedEntries: 0, completionRate: 0 },
                goals: { completedEntries: 0, completionRate: 0 },
                totalEntries: 0,
            };
        }
    }
}
