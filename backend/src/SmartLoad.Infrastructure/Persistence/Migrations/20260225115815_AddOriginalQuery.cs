using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartLoad.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddOriginalQuery : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OriginalBoxes",
                table: "LoadPlans",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "OriginalBoxes",
                table: "LoadPlans");
        }
    }
}
