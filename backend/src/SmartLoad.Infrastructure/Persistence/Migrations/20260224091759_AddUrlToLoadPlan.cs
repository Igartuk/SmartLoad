using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SmartLoad.Infrastructure.Persistence.Migrations
{
    /// <inheritdoc />
    public partial class AddUrlToLoadPlan : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Url",
                table: "LoadPlans",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Url",
                table: "LoadPlans");
        }
    }
}
