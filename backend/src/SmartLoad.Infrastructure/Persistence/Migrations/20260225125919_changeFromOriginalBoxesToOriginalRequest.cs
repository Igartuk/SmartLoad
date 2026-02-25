using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartLoad.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class changeFromOriginalBoxesToOriginalRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalBoxes",
                table: "LoadPlans");

            migrationBuilder.AddColumn<string>(
                name: "OriginalRequest",
                table: "LoadPlans",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalRequest",
                table: "LoadPlans");

            migrationBuilder.AddColumn<string>(
                name: "OriginalBoxes",
                table: "LoadPlans",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }
    }
}
