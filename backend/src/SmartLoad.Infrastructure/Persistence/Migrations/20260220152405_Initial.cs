using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartLoad.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class Initial : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "LoadPlans",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Vehicle_Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VehicleName = table.Column<string>(type: "text", nullable: false),
                    Vehicle_Type = table.Column<int>(type: "integer", nullable: false),
                    Vehicle_InnerDimensions_Width = table.Column<double>(type: "double precision", nullable: false),
                    Vehicle_InnerDimensions_Height = table.Column<double>(type: "double precision", nullable: false),
                    Vehicle_InnerDimensions_Depth = table.Column<double>(type: "double precision", nullable: false),
                    Vehicle_MaxPayload = table.Column<double>(type: "double precision", nullable: false),
                    PackedItems = table.Column<string>(type: "jsonb", nullable: false),
                    UnpackedItems = table.Column<string>(type: "jsonb", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoadPlans", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoadPlans");
        }
    }
}
