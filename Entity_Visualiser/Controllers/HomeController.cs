using Entity_Visualiser.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.Common;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Entity_Visualiser.Controllers
{
    public class HomeController : Controller
    {
        #region Public Methods
        public ActionResult Index()
        {
            return View();
        }
        
        
        public ActionResult GetERDiagram(DBConnectionModel model)
        {
           
            if (model.ServerName != null && model.DataBaseName != null)
            {
                using (var connection = GetConnection(model.ServerName, model.DataBaseName, model.UserName, model.Password, model.IsSecure))
                {
                   
                    connection.Open();

                    if (connection.State == ConnectionState.Open)
                    {
                        
                        var dbInfo = new DBSchemaInfo();
                        dbInfo.links = GetLinks(connection);
                        dbInfo.nodes = GetNodes(connection);
                        return View(dbInfo);
                    }
                    else
                    {
                        return RedirectToAction("Error");
                    }
                }
            }
            else
            {
                return RedirectToAction("Index");
            }
        }
        #endregion
        #region Private Methods
        private SqlConnection GetConnection(string serverName, string dbName, string userName, string pwd,string isSecure)
        {
            if (isSecure == "false" && userName != null&& pwd!=null)
            {
                SqlConnection connection = new SqlConnection(@"data source=" + serverName + ";initial catalog=" + dbName + ";integrated security=False;User Id="+userName+";Password="+pwd+";");
                return connection;
            }
            else
            {
                SqlConnection connection = new SqlConnection(@"data source=" + serverName + ";initial catalog=" + dbName + ";integrated security=True;");
                return connection;
            }
        }
       
        private List<Links> GetLinks(SqlConnection connection)
        {
            var query = "SELECT prn.TABLE_NAME as Source,chld.TABLE_NAME as Target FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS  RC " +
                    "INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE prn " +
                    "ON prn.CONSTRAINT_CATALOG = RC.CONSTRAINT_CATALOG " +
                    "AND prn.CONSTRAINT_SCHEMA = RC.CONSTRAINT_SCHEMA " +
                    "AND prn.CONSTRAINT_NAME = RC.CONSTRAINT_NAME " +
                    "INNER JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE chld " +
                    "ON chld.CONSTRAINT_CATALOG = RC.UNIQUE_CONSTRAINT_CATALOG " +
                    "AND chld.CONSTRAINT_SCHEMA = RC.UNIQUE_CONSTRAINT_SCHEMA " +
                    "AND chld.CONSTRAINT_NAME = RC.UNIQUE_CONSTRAINT_NAME " +
                    "AND chld.ORDINAL_POSITION = prn.ORDINAL_POSITION ";
            SqlCommand command1 = new SqlCommand(query, connection);

            SqlDataReader reader = command1.ExecuteReader();
            var links = new List<Links>();
            try
            {
                while (reader.Read())
                {
                    links.Add(new Links()
                    {
                        source = reader["Source"].ToString(),
                        target = reader["Target"].ToString()
                    });
                }
            }
            finally
            {
                reader.Close();
            }
            return links;
        }

        private List<Nodes> GetNodes(SqlConnection connection)
        {
            var tablesQuery = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES;";
            SqlCommand command2 = new SqlCommand(tablesQuery, connection);
            SqlDataReader tablesReader = command2.ExecuteReader();
            var nodes = new List<Nodes>();
            try
            {
                while (tablesReader.Read())
                {
                    nodes.Add(new Nodes()
                    {
                        Table = tablesReader["TABLE_NAME"].ToString(),
                    });
                }
            }
            finally
            {
                tablesReader.Close();
            }
            foreach(var table in nodes)
            {
                table.columns = GetColumnsOfTable(table.Table, connection);
            }
            return nodes;
        }

        private List<Columns> GetColumnsOfTable(string tableName,SqlConnection connection)
        {
            var columnsQuery = "SELECT Column_Name,DATA_TYPE, case data_type "+
                "when 'nvarchar' "+
                "then CHARACTER_MAXIMUM_LENGTH "+
                "when 'varchar' "+
                "then CHARACTER_MAXIMUM_LENGTH "+
                "else null "+
                "end as '@Length', "+
                "IS_NULLABLE AS '@IsNullable', "+
                "COLUMNPROPERTY(OBJECT_ID(TABLE_NAME), COLUMN_NAME, 'IsIdentity') AS '@IsIdentity' FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME ='" + tableName + "';";
            SqlCommand command3 = new SqlCommand(columnsQuery,connection);
            SqlDataReader columnReader = command3.ExecuteReader();
            var columns = new List<Columns>();
            try
            {
                while (columnReader.Read())
                {
                    columns.Add(new Columns()
                    {
                        name = columnReader["Column_Name"].ToString(),
                        dataType = columnReader["DATA_TYPE"].ToString(),
                        length = columnReader["@Length"].ToString(),
                        isNullable = columnReader["@IsNullable"].ToString(),
                        isIdentity = columnReader["@IsIdentity"].ToString()
                    });
                }

            }
            finally
            {
                columnReader.Close();
            }
            return columns;
        }
        #endregion

    }
}