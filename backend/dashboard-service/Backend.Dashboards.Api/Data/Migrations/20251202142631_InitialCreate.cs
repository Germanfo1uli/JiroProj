using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Backend.Dashboards.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "dashboard_service_schema");

            migrationBuilder.CreateTable(
                name: "activity_logs",
                schema: "dashboard_service_schema",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProjectId = table.Column<long>(type: "bigint", nullable: false),
                    UserId = table.Column<long>(type: "bigint", nullable: false),
                    ActionType = table.Column<int>(type: "integer", nullable: false),
                    EntityType = table.Column<int>(type: "integer", nullable: false),
                    EntityId = table.Column<long>(type: "bigint", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_activity_logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "dashboard_snapshots",
                schema: "dashboard_service_schema",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProjectId = table.Column<long>(type: "bigint", nullable: false),
                    SnapshotDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MetricName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    MetricValue = table.Column<decimal>(type: "numeric", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_dashboard_snapshots", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_ActionType",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "ActionType");

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_CreatedAt",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_EntityId",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "EntityId");

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_EntityType",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "EntityType");

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_ProjectId",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_activity_logs_UserId",
                schema: "dashboard_service_schema",
                table: "activity_logs",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_dashboard_snapshots_CreatedAt",
                schema: "dashboard_service_schema",
                table: "dashboard_snapshots",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_dashboard_snapshots_MetricName",
                schema: "dashboard_service_schema",
                table: "dashboard_snapshots",
                column: "MetricName");

            migrationBuilder.CreateIndex(
                name: "IX_dashboard_snapshots_ProjectId",
                schema: "dashboard_service_schema",
                table: "dashboard_snapshots",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_dashboard_snapshots_SnapshotDate",
                schema: "dashboard_service_schema",
                table: "dashboard_snapshots",
                column: "SnapshotDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "activity_logs",
                schema: "dashboard_service_schema");

            migrationBuilder.DropTable(
                name: "dashboard_snapshots",
                schema: "dashboard_service_schema");
        }
    }
}
